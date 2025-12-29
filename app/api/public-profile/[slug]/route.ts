

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const publicProfile = await prisma.publicProfile.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        enabled: true,
        seoIndexable: true,
        showProfile: true,
        showSkills: true,
        showExperience: true,
        showProjects: true,
        showContact: true,
        allowCvRequest: true,
        selectedProjectIds: true,
        selectedExperienceIds: true,
        selectedCvId: true,
        userId: true,
      },
    })

    if (!publicProfile || !publicProfile.enabled) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const userId = publicProfile.userId

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        profile: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const [skillsData, experiencesData, documentsData, portfolioItemsData] = await Promise.all([

      prisma.skill.findMany({
        where: {
          userId,
          projectSkills: { some: {} },
        },
        select: {
          id: true,
          name: true,
          level: true,
          category: {
            select: {
              name: true,
            },
          },
          projectSkills: {
            select: {
              id: true,
            },
          },
        },
        orderBy: [
          { category: { order: 'asc' } },
          { name: 'asc' },
        ],
      }).catch(() => []),

      prisma.experience.findMany({
        where: { userId },
        select: {
          id: true,
          company: true,
          role: true,
          startDate: true,
          endDate: true,
          location: true,
          bullets: true,
          experienceProjects: {
            select: {
              id: true,
            },
          },
        },
        orderBy: { startDate: 'desc' },
      }).catch(() => []),

      prisma.document.findMany({
        where: {
          userId,
          type: 'CV',
        },
        select: {
          id: true,
          name: true,
          fileUrl: true,
        },
        orderBy: { createdAt: 'desc' },
      }).catch(() => []),

      prisma.portfolioItem.findMany({
        where: {
          userId,
          isPublished: true,
        },
        select: {
          id: true,
          title: true,
          description: true,
          url: true,
          tags: true,
          imageUrl: true,
        },
        orderBy: { order: 'asc' },
      }).catch(() => []),
    ])

    let filteredPortfolioItems = portfolioItemsData
    if (publicProfile.selectedProjectIds && publicProfile.selectedProjectIds.length > 0) {
      filteredPortfolioItems = portfolioItemsData.filter((item) =>
        publicProfile.selectedProjectIds.includes(item.id)
      )
    }

    let filteredExperiences = experiencesData
    if (publicProfile.selectedExperienceIds && publicProfile.selectedExperienceIds.length > 0) {
      filteredExperiences = experiencesData.filter((exp) =>
        publicProfile.selectedExperienceIds.includes(exp.id)
      )
    }

    const result = {
      ...publicProfile,
      user: {
        ...user,
        skills: skillsData,
        experiences: filteredExperiences,
        documents: documentsData,
        portfolioItems: filteredPortfolioItems,
      },
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error('Error fetching public profile:', error)
    return NextResponse.json(
      { error: 'Failed to load public profile' },
      { status: 500 }
    )
  }
}

