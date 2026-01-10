import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET to .env')
  }

  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Missing svix headers', { status: 400 })
  }

  const payload = await req.json()
  const body = JSON.stringify(payload)

  const wh = new Webhook(WEBHOOK_SECRET)
  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Webhook verification failed:', err)
    return new Response('Webhook verification failed', { status: 400 })
  }

  const supabase = createAdminClient()

  switch (evt.type) {
    case 'user.created': {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data
      const primaryEmail = email_addresses[0]?.email_address

      if (!primaryEmail) {
        return new Response('No email address', { status: 400 })
      }

      // Create user record
      const { data: user, error: userError } = await supabase
        .from('users')
        .insert({
          clerk_id: id,
          email: primaryEmail,
          first_name: first_name || null,
          last_name: last_name || null,
          avatar_url: image_url || null,
          role: 'client', // Default role
        })
        .select()
        .single()

      if (userError) {
        console.error('Error creating user:', userError)
        return new Response('Error creating user', { status: 500 })
      }

      // Create associated client record
      const { error: clientError } = await supabase.from('clients').insert({
        user_id: user.id,
        name: [first_name, last_name].filter(Boolean).join(' ') || 'New Client',
        email: primaryEmail,
      })

      if (clientError) {
        console.error('Error creating client:', clientError)
        // Don't fail the webhook - user was created
      }

      break
    }

    case 'user.updated': {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data
      const primaryEmail = email_addresses[0]?.email_address

      const { error } = await supabase
        .from('users')
        .update({
          email: primaryEmail,
          first_name: first_name || null,
          last_name: last_name || null,
          avatar_url: image_url || null,
        })
        .eq('clerk_id', id)

      if (error) {
        console.error('Error updating user:', error)
        return new Response('Error updating user', { status: 500 })
      }

      break
    }

    case 'user.deleted': {
      const { id } = evt.data

      if (!id) {
        return new Response('No user id', { status: 400 })
      }

      // Cascade delete will handle clients and related data
      const { error } = await supabase.from('users').delete().eq('clerk_id', id)

      if (error) {
        console.error('Error deleting user:', error)
        return new Response('Error deleting user', { status: 500 })
      }

      break
    }
  }

  return new Response('OK', { status: 200 })
}
