/**
 * Profile API Routes
 * GET /api/profile - Get user profile
 * PUT /api/profile - Update user profile
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { profileUpdateSchema } from '@/lib/validations/profile'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      include: {
        user: {
          select: {
            email: true,
            fullName: true,
          },
        },
      },
    })

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = profileUpdateSchema.parse(body)

    // Update or create profile
    const profile = await prisma.profile.upsert({
      where: { userId: session.user.id },
      update: {
        fullName: validatedData.fullName || null,
        title: validatedData.title || null,
        bio: validatedData.bio || null,
        location: validatedData.location || null,
        phone: validatedData.phone || null,
        website: validatedData.website || null,
        github: validatedData.github || null,
        linkedin: validatedData.linkedin || null,
        otherLink: validatedData.otherLink || null,
        otherLinkLabel: validatedData.otherLinkLabel || null,
        isPublic: validatedData.isPublic,
      },
      create: {
        userId: session.user.id,
        fullName: validatedData.fullName || null,
        title: validatedData.title || null,
        bio: validatedData.bio || null,
        location: validatedData.location || null,
        phone: validatedData.phone || null,
        website: validatedData.website || null,
        github: validatedData.github || null,
        linkedin: validatedData.linkedin || null,
        otherLink: validatedData.otherLink || null,
        otherLinkLabel: validatedData.otherLinkLabel || null,
        isPublic: validatedData.isPublic,
      },
    })

    return NextResponse.json({ profile })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

