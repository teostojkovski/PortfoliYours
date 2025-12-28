import { prisma } from '@/lib/prisma'
import { publicProfileSchema } from '@/lib/validations/public-profile'
import { z } from 'zod'

export async function getPublicProfileBySlug(slug: string) {
  try {
    // Use raw SQL to bypass Prisma client corruption issues
    const publicProfileResult = await prisma.$queryRaw<Array<{
      id: string
      slug: string
      enabled: boolean
      seoIndexable: boolean
      showProfile: boolean
      showSkills: boolean
      showExperience: boolean
      showProjects: boolean
      showContact: boolean
      allowCvRequest: boolean
      selectedProjectIds: string[]
      selectedExperienceIds: string[]
      selectedCvId: string | null
      userId: string
    }>>`
      SELECT 
        id, slug, enabled, "seoIndexable",
        "showProfile", "showSkills", "showExperience", "showProjects",
        "showContact", "allowCvRequest",
        "selectedProjectIds", "selectedExperienceIds", "selectedCvId",
        "userId"
      FROM public_profiles
      WHERE slug = ${slug} AND enabled = true
      LIMIT 1
    `

    if (!publicProfileResult || publicProfileResult.length === 0) {
      return null
    }

    const publicProfile = publicProfileResult[0]
    const userId = publicProfile.userId

    // Get user with raw SQL
    const userResult = await prisma.$queryRaw<Array<{
      id: string
      fullName: string
      dateOfBirth: Date
    }>>`
      SELECT id, "fullName", "dateOfBirth"
      FROM users
      WHERE id = ${userId}
      LIMIT 1
    `

    if (!userResult || userResult.length === 0) {
      return null
    }

    const user = userResult[0]

    // Get profile with raw SQL
    const profileResult = await prisma.$queryRaw<Array<{
      id: string
      title: string | null
      bio: string | null
      location: string | null
      avatarUrl: string | null
      website: string | null
      github: string | null
      linkedin: string | null
      otherLink: string | null
      otherLabel: string | null
    }>>`
      SELECT id, title, bio, location, "avatarUrl",
             website, github, linkedin, "otherLink", "otherLabel"
      FROM profiles
      WHERE "userId" = ${userId}
      LIMIT 1
    `

    const profile = profileResult && profileResult.length > 0 ? profileResult[0] : null

    // Get skills with categories (show all skills that have linked projects)
    const skillsResult = await prisma.$queryRaw<Array<{
      id: string
      name: string
      level: number
      categoryName: string
    }>>`
      SELECT DISTINCT s.id, s.name, s.level, sc.name as "categoryName"
      FROM skills s
      INNER JOIN skill_categories sc ON s."categoryId" = sc.id
      INNER JOIN project_skills ps ON ps."skillId" = s.id
      WHERE s."userId" = ${userId}
      ORDER BY sc."order" ASC, s.name ASC
    `.catch(() => [])

    // Group skills by category
    const skillsByCategory: Record<string, Array<{
      id: string
      name: string
      level: number
      category: { name: string }
      projectSkills: Array<{ id: string }>
    }>> = {}

    for (const skill of skillsResult || []) {
      if (!skillsByCategory[skill.categoryName]) {
        skillsByCategory[skill.categoryName] = []
      }
      skillsByCategory[skill.categoryName].push({
        id: skill.id,
        name: skill.name,
        level: skill.level,
        category: { name: skill.categoryName },
        projectSkills: [{ id: 'placeholder' }], // Placeholder for compatibility
      })
    }

    // Get experiences
    const experiencesResult = await prisma.$queryRaw<Array<{
      id: string
      company: string
      role: string
      startDate: Date
      endDate: Date | null
      location: string | null
      bullets: string[]
    }>>`
      SELECT id, company, role, "startDate", "endDate", location, bullets
      FROM experiences
      WHERE "userId" = ${userId}
      ORDER BY "startDate" DESC
    `.catch(() => [])

    // Filter experiences based on selected IDs
    let filteredExperiences = experiencesResult || []
    if (publicProfile.selectedExperienceIds && publicProfile.selectedExperienceIds.length > 0) {
      filteredExperiences = filteredExperiences.filter((exp: any) =>
        publicProfile.selectedExperienceIds.includes(exp.id)
      )
    }

    // Get documents (CVs)
    const documentsResult = await prisma.$queryRaw<Array<{
      id: string
      name: string
      fileUrl: string
    }>>`
      SELECT id, name, "fileUrl"
      FROM documents
      WHERE "userId" = ${userId} AND type = 'CV'
      ORDER BY "createdAt" DESC
    `.catch(() => [])

    // Get portfolio items (projects) - only get explicitly selected ones
    let portfolioResult: Array<{
      id: string
      title: string
      description: string | null
      url: string | null
      tags: string[]
      imageUrl: string | null
    }> = []

    if (publicProfile.selectedProjectIds && publicProfile.selectedProjectIds.length > 0) {
      // Get only selected projects (regardless of published status since user explicitly selected them)
      portfolioResult = await prisma.$queryRaw`
        SELECT id, title, description, url, tags, "imageUrl"
        FROM portfolio_items
        WHERE "userId" = ${userId} AND id = ANY(${publicProfile.selectedProjectIds}::text[])
        ORDER BY "order" ASC, "createdAt" DESC
      `.catch(() => [])
    }

    const filteredPortfolioItems = portfolioResult || []

    // Get selected CV
    const selectedCv = publicProfile.selectedCvId
      ? documentsResult.find((doc: any) => doc.id === publicProfile.selectedCvId) || null
      : null

    // Convert skills object to array format expected by component
    const skillsArray = Object.values(skillsByCategory).flat()

    return {
      ...publicProfile,
      user: {
        id: user.id,
        fullName: user.fullName,
        dateOfBirth: user.dateOfBirth,
        profile,
        skills: skillsArray,
        experiences: filteredExperiences.map((exp: any) => ({
          ...exp,
          experienceProjects: [],
        })),
        documents: documentsResult,
        portfolioItems: filteredPortfolioItems,
      },
    }
  } catch (error) {
    console.error('Error fetching public profile (raw SQL):', error)
    return null
  }
}

export async function getPublicProfileByUserId(userId: string) {
  try {
    return await prisma.publicProfile.findUnique({
      where: { userId },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    })
  } catch (error) {
    console.error('Error fetching public profile by user ID:', error)
    return null
  }
}

export async function createOrUpdatePublicProfile(
  userId: string,
  data: z.infer<typeof publicProfileSchema>
) {
  const validatedData = publicProfileSchema.parse(data)

  // Check if slug is already taken by another user
  const existingSlug = await prisma.publicProfile.findUnique({
    where: { slug: validatedData.slug },
  })

  if (existingSlug && existingSlug.userId !== userId) {
    throw new Error('This username is already taken')
  }

  // Get or create public profile
  const existing = await prisma.publicProfile.findUnique({
    where: { userId },
  })

  if (existing) {
    return await prisma.publicProfile.update({
      where: { userId },
      data: validatedData,
    })
  }

  return await prisma.publicProfile.create({
    data: {
      ...validatedData,
      userId,
    },
  })
}

export async function checkSlugAvailability(slug: string, excludeUserId?: string) {
  const existing = await prisma.publicProfile.findUnique({
    where: { slug },
  })

  if (!existing) {
    return true
  }

  if (excludeUserId && existing.userId === excludeUserId) {
    return true
  }

  return false
}
