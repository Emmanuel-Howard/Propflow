import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET /api/admin/templates - List all templates
export async function GET(request: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    const supabase = createAdminClient()

    let query = supabase
      .from('templates')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (category && category !== 'All') {
      query = query.eq('category', category.toLowerCase())
    }

    const { data: templates, error } = await query

    if (error) {
      console.error('Error fetching templates:', error)
      return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 })
    }

    // Get usage count for each template
    const templatesWithUsage = await Promise.all(
      (templates || []).map(async (template) => {
        const { count } = await supabase
          .from('campaigns')
          .select('*', { count: 'exact', head: true })
          .eq('template_id', template.id)

        return {
          ...template,
          usage_count: count || 0,
        }
      })
    )

    return NextResponse.json(templatesWithUsage)
  } catch (error) {
    console.error('Error in GET /api/admin/templates:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/templates - Create a new template
export async function POST(request: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, content_html, category } = body

    if (!name || !content_html) {
      return NextResponse.json(
        { error: 'Name and content are required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Get user id from clerk_id
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', userId)
      .single()

    const { data: template, error } = await supabase
      .from('templates')
      .insert({
        name,
        description,
        content_html,
        category: category || 'newsletter',
        created_by: user?.id,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating template:', error)
      return NextResponse.json({ error: 'Failed to create template' }, { status: 500 })
    }

    return NextResponse.json(template, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/admin/templates:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
