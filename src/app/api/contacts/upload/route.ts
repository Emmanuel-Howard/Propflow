import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase/admin'
import Papa from 'papaparse'

interface CSVRow {
  email?: string
  Email?: string
  EMAIL?: string
  first_name?: string
  firstName?: string
  'First Name'?: string
  last_name?: string
  lastName?: string
  'Last Name'?: string
  phone?: string
  Phone?: string
  tags?: string
  Tags?: string
}

// POST /api/contacts/upload - Bulk upload contacts from CSV
export async function POST(request: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const clientId = formData.get('client_id') as string | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!clientId) {
      return NextResponse.json({ error: 'client_id is required' }, { status: 400 })
    }

    // Read file content
    const text = await file.text()

    // Parse CSV
    const { data, errors } = Papa.parse<CSVRow>(text, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
    })

    if (errors.length > 0) {
      console.error('CSV parsing errors:', errors)
      return NextResponse.json(
        { error: 'Failed to parse CSV file', details: errors },
        { status: 400 }
      )
    }

    if (data.length === 0) {
      return NextResponse.json({ error: 'CSV file is empty' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Get existing emails to avoid duplicates
    const { data: existingContacts } = await supabase
      .from('contacts')
      .select('email')
      .eq('client_id', clientId)

    const existingEmails = new Set(
      (existingContacts || []).map((c) => c.email.toLowerCase())
    )

    // Process rows
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const validContacts: {
      client_id: string
      email: string
      first_name: string | null
      last_name: string | null
      phone: string | null
      tags: string[]
      source: string
      status: string
    }[] = []
    const skippedRows: { row: number; reason: string }[] = []
    const duplicateEmails: string[] = []

    data.forEach((row, index) => {
      // Get email from various possible column names
      const email = (
        row.email ||
        row.Email ||
        row.EMAIL ||
        ''
      ).trim().toLowerCase()

      if (!email) {
        skippedRows.push({ row: index + 2, reason: 'Missing email' })
        return
      }

      if (!emailRegex.test(email)) {
        skippedRows.push({ row: index + 2, reason: 'Invalid email format' })
        return
      }

      if (existingEmails.has(email)) {
        duplicateEmails.push(email)
        return
      }

      // Check for duplicates within the CSV
      if (validContacts.some((c) => c.email === email)) {
        duplicateEmails.push(email)
        return
      }

      // Get name from various possible column names
      const firstName = (
        row.first_name ||
        row.firstName ||
        row['First Name'] ||
        ''
      ).trim() || null

      const lastName = (
        row.last_name ||
        row.lastName ||
        row['Last Name'] ||
        ''
      ).trim() || null

      const phone = (row.phone || row.Phone || '').trim() || null

      // Parse tags (comma-separated string)
      const tagsStr = (row.tags || row.Tags || '').trim()
      const tags = tagsStr ? tagsStr.split(',').map((t) => t.trim()).filter(Boolean) : []

      validContacts.push({
        client_id: clientId,
        email,
        first_name: firstName,
        last_name: lastName,
        phone,
        tags,
        source: 'csv_import',
        status: 'active',
      })
    })

    // Insert valid contacts
    let insertedCount = 0
    if (validContacts.length > 0) {
      const { data: inserted, error } = await supabase
        .from('contacts')
        .insert(validContacts)
        .select()

      if (error) {
        console.error('Error inserting contacts:', error)
        return NextResponse.json(
          { error: 'Failed to insert contacts' },
          { status: 500 }
        )
      }

      insertedCount = inserted?.length || 0
    }

    // Log activity
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', userId)
      .single()

    await supabase.from('activity_logs').insert({
      client_id: clientId,
      user_id: user?.id,
      action: 'contacts_imported',
      entity_type: 'contact',
      metadata: {
        fileName: file.name,
        totalRows: data.length,
        imported: insertedCount,
        duplicates: duplicateEmails.length,
        skipped: skippedRows.length,
      },
    })

    return NextResponse.json({
      success: true,
      summary: {
        totalRows: data.length,
        imported: insertedCount,
        duplicates: duplicateEmails.length,
        skipped: skippedRows.length,
      },
      details: {
        skippedRows: skippedRows.slice(0, 10), // Only return first 10
        duplicateEmails: duplicateEmails.slice(0, 10), // Only return first 10
      },
    })
  } catch (error) {
    console.error('Error in POST /api/contacts/upload:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
