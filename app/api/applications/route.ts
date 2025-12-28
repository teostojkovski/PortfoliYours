/**
 * Applications API Route
 * Route: GET, POST /api/applications
 * Handles application listing and creation
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getApplicationsByUserId, createApplication } from '@/lib/services/application'
import { applicationSchema } from '@/lib/validations/application'
import { z } from 'zod'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || undefined
    const archived = searchParams.get('archived') === 'true' ? true : undefined

    const applications = await getApplicationsByUserId(session.user.id, status, archived)

    return NextResponse.json({ applications }, { status: 200 })
  } catch (error) {
    console.error('Applications fetch error:', error)
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
    const data = {
      company: formData.get('company') as string,
      role: formData.get('role') as string,
      location: formData.get('location') as string | null,
      status: formData.get('status') as string,
      appliedAt: formData.get('appliedAt') as string | null,
      link: formData.get('link') as string | null,
      notes: formData.get('notes') as string | null,
      recruiterName: formData.get('recruiterName') as string | null,
      recruiterEmail: formData.get('recruiterEmail') as string | null,
      followUpAt: formData.get('followUpAt') as string | null,
      cvDocumentId: formData.get('cvDocumentId') as string | null,
      coverLetterDocumentId: formData.get('coverLetterDocumentId') as string | null,
      saveCvToDocuments: formData.get('saveCvToDocuments') === 'true',
      saveCoverLetterToDocuments: formData.get('saveCoverLetterToDocuments') === 'true',
    }

    const cvFile = formData.get('cvFile') as File | null
    const coverLetterFile = formData.get('coverLetterFile') as File | null

    // Handle file uploads (simplified - in production, upload to storage first)
    let cvFileData = undefined
    let coverLetterFileData = undefined

    if (cvFile) {
      cvFileData = {
        url: `/uploads/${session.user.id}/${Date.now()}-${cvFile.name}`,
        name: cvFile.name,
        type: cvFile.type.split('/')[1] || 'pdf',
        size: cvFile.size,
      }
    }

    if (coverLetterFile) {
      coverLetterFileData = {
        url: `/uploads/${session.user.id}/${Date.now()}-${coverLetterFile.name}`,
        name: coverLetterFile.name,
        type: coverLetterFile.type.split('/')[1] || 'pdf',
        size: coverLetterFile.size,
      }
    }

    const application = await createApplication(session.user.id, {
      ...data,
      cvFile: cvFileData,
      coverLetterFile: coverLetterFileData,
    })

    return NextResponse.json({ application }, { status: 201 })
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

    console.error('Application creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

