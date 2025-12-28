/**
 * Public Profile Service - Raw SQL Workaround
 * Uses raw SQL queries to avoid Prisma client issues
 */

import { prisma } from '@/lib/prisma'

export async function getPublicProfileBySlug(slug: string) {
  try {
    // Use raw SQL as a workaround for Prisma client corruption
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

    // Get user and profile
    const userResult = await prisma.$queryRaw<Array<{
      id: string
      fullName: string
    }>>`
      SELECT id, "fullName"
      FROM users
      WHERE id = ${publicProfile.userId}
      LIMIT 1
    `

    if (!userResult || userResult.length === 0) {
      return null
    }

    const user = userResult[0]

    // Get profile
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
      WHERE "userId" = ${publicProfile.userId}
      LIMIT 1
    `

    const profile = profileResult && profileResult.length > 0 ? profileResult[0] : null

    // For now, return empty arrays for related data to avoid more queries
    // This gets the page working, then we can add the rest
    return {
      ...publicProfile,
      user: {
        ...user,
        profile,
        skills: [],
        experiences: [],
        documents: [],
        portfolioItems: [],
      },
    }
  } catch (error) {
    console.error('Error fetching public profile (raw SQL):', error)
    return null
  }
}

