import { prisma } from '@/lib/prisma'
import { experienceSchema } from '@/lib/validations/experience'
import { z } from 'zod'

export async function getExperiencesByUserId(userId: string) {
  return await prisma.experience.findMany({
    where: { userId },
    include: {
      experienceProjects: {
        include: {
          experience: true,
        },
      },
    },
    orderBy: {
      startDate: 'desc',
    },
  })
}

export async function getExperienceById(experienceId: string, userId: string) {
  return await prisma.experience.findFirst({
    where: { id: experienceId, userId },
    include: {
      experienceProjects: true,
    },
  })
}

export async function createExperience(userId: string, data: z.infer<typeof experienceSchema>) {
  const validatedData = experienceSchema.parse(data)

  const { projectIds, ...experienceData } = validatedData

  const experience = await prisma.experience.create({
    data: {
      ...experienceData,
      userId,
      endDate: validatedData.endDate || null,
    },
  })

  // Link projects if provided
  if (projectIds && projectIds.length > 0) {
    await prisma.experienceProject.createMany({
      data: projectIds.map((projectId) => ({
        experienceId: experience.id,
        projectId,
        projectType: 'portfolio',
      })),
      skipDuplicates: true,
    })
  }

  return experience
}

export async function updateExperience(experienceId: string, userId: string, data: z.infer<typeof experienceSchema>) {
  const validatedData = experienceSchema.parse(data)

  // Verify ownership
  const existing = await prisma.experience.findFirst({
    where: { id: experienceId, userId },
  })

  if (!existing) {
    throw new Error('Experience not found')
  }

  const { projectIds, ...experienceData } = validatedData

  const experience = await prisma.experience.update({
    where: { id: experienceId },
    data: {
      ...experienceData,
      endDate: validatedData.endDate || null,
    },
  })

  // Update project links
  if (projectIds !== undefined) {
    // Remove existing links
    await prisma.experienceProject.deleteMany({
      where: { experienceId },
    })

    // Add new links
    if (projectIds.length > 0) {
      await prisma.experienceProject.createMany({
        data: projectIds.map((projectId) => ({
          experienceId: experience.id,
          projectId,
          projectType: 'portfolio',
        })),
        skipDuplicates: true,
      })
    }
  }

  return experience
}

export async function deleteExperience(experienceId: string, userId: string) {
  const experience = await prisma.experience.findFirst({
    where: { id: experienceId, userId },
  })

  if (!experience) {
    throw new Error('Experience not found')
  }

  await prisma.experience.delete({
    where: { id: experienceId },
  })
}

