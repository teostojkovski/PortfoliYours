/**
 * Document Upload API Route
 * Route: POST /api/document/upload
 * Handles file upload and creates document entry
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createDocument, getFileTypeFromMime, validateFileSize } from '@/lib/services/document'
import { documentSchema } from '@/lib/validations/document'
import { z } from 'zod'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

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
        { error: 'Invalid file type. Allowed types: PDF, DOC, DOCX, PNG, JPG, JPEG' },
        { status: 400 }
      )
    }

    // Validate file size
    if (!validateFileSize(file.size)) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      )
    }

    // Validate document data
    const documentData = documentSchema.parse({ name, type, notes })

    // Save file to public/uploads/documents
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'documents')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    const fileName = `${session.user.id}-${Date.now()}-${file.name}`
    const filePath = join(uploadsDir, fileName)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    await writeFile(filePath, buffer)

    // Create document entry
    const fileUrl = `/uploads/documents/${fileName}`
    const document = await createDocument(session.user.id, {
      ...documentData,
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

    console.error('Document upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

