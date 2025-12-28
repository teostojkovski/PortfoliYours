/**
 * Documents API Route
 * Route: GET, POST /api/documents
 * Handles document listing and creation
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDocumentsByUserId, createDocument, getFileTypeFromMime } from '@/lib/services/document'
import { documentSchema } from '@/lib/validations/document'
import { z } from 'zod'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || undefined

    const documents = await getDocumentsByUserId(session.user.id, type)

    return NextResponse.json({ documents }, { status: 200 })
  } catch (error) {
    console.error('Documents fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const name = formData.get('name') as string
    const type = formData.get('type') as string
    const notes = formData.get('notes') as string | null

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 })
    }

    // Validate file type
    const fileType = getFileTypeFromMime(file.type)
    if (!fileType) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: PDF, DOC, DOCX, PNG, JPG' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      )
    }

    // For now, we'll store the file URL as a placeholder
    // In production, you'd upload to S3/R2/Supabase Storage and get a URL
    const fileUrl = `/uploads/${session.user.id}/${Date.now()}-${file.name}`

    const document = await createDocument(session.user.id, {
      name,
      type: type as 'CV' | 'COVER_LETTER' | 'OTHER',
      notes: notes || undefined,
      fileUrl,
      fileType,
      fileSize: file.size,
    })

    return NextResponse.json({ document }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    console.error('Document creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

