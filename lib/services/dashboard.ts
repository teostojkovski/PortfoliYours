import { prisma } from '@/lib/prisma'

export interface ProfileCompleteness {
  percentage: number
  hasProfilePicture: boolean
  hasProfileDetails: boolean
  hasProjects: boolean
  hasSkills: boolean
  hasExperience: boolean
}

export async function getProfileCompleteness(userId: string): Promise<ProfileCompleteness> {
  const [profile, projects, skills, experiences] = await Promise.all([
    prisma.profile.findUnique({
      where: { userId },
      select: {
        avatarUrl: true,
        title: true,
        bio: true,
        location: true,
      },
    }),
    prisma.portfolioItem.count({
      where: { userId },
    }),
    prisma.skill.count({
      where: { userId },
    }),
    prisma.experience.count({
      where: { userId },
    }),
  ])

  const hasProfilePicture = !!profile?.avatarUrl
  const hasProfileDetails = !!(profile?.title && profile?.bio && profile?.location)
  const hasProjects = projects > 0
  const hasSkills = skills > 0
  const hasExperience = experiences > 0

  let completed = 0
  if (hasProfilePicture && hasProfileDetails) completed += 25
  if (hasProjects) completed += 25
  if (hasSkills) completed += 25
  if (hasExperience) completed += 25

  return {
    percentage: completed,
    hasProfilePicture,
    hasProfileDetails,
    hasProjects,
    hasSkills,
    hasExperience,
  }
}

export async function getDashboardData(userId: string) {
  const [profile, topProjects, recentExperience, completeness] = await Promise.all([
    prisma.profile.findUnique({
      where: { userId },
      select: {
        avatarUrl: true,
        title: true,
        bio: true,
        location: true,
      },
    }),
    prisma.portfolioItem.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
      },
    }),
    prisma.experience.findFirst({
      where: { userId },
      orderBy: { startDate: 'desc' },
      select: {
        id: true,
        company: true,
        role: true,
        startDate: true,
        endDate: true,
      },
    }),
    getProfileCompleteness(userId),
  ])

  return {
    profile,
    topProjects,
    recentExperience,
    completeness,
  }
}

