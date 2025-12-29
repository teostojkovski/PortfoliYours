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
      experienceSkills: {
        select: {
          skillId: true,
        },
      },
    },
  })
}

export async function createExperience(userId: string, data: z.infer<typeof experienceSchema>) {
  const validatedData = experienceSchema.parse(data)

  const { projectIds, skillIds, ...experienceData } = validatedData

  const experience = await prisma.experience.create({
    data: {
      ...experienceData,
      userId,
      endDate: validatedData.endDate || null,
    },
  })

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

  if (skillIds && skillIds.length > 0) {
    const userSkills = await prisma.skill.findMany({
      where: {
        userId,
        id: { in: skillIds },
      },
    })

    if (userSkills.length !== skillIds.length) {
      throw new Error('One or more skills not found')
    }

    try {
      await prisma.experienceSkill.createMany({
        data: skillIds.map((skillId) => ({
          experienceId: experience.id,
          skillId,
        })),
        skipDuplicates: true,
      })
    } catch (error: any) {
      if (error?.message?.includes('does not exist')) {
        console.error('ExperienceSkill table not found. Please run: npx prisma db push')
        throw new Error('Database table missing. Please contact support.')
      }
      throw error
    }
  }

  return experience
}

export async function updateExperience(experienceId: string, userId: string, data: z.infer<typeof experienceSchema>) {
  const validatedData = experienceSchema.parse(data)

  const existing = await prisma.experience.findFirst({
    where: { id: experienceId, userId },
  })

  if (!existing) {
    throw new Error('Experience not found')
  }

  const { projectIds, skillIds, ...experienceData } = validatedData

  const experience = await prisma.experience.update({
    where: { id: experienceId },
    data: {
      ...experienceData,
      endDate: validatedData.endDate || null,
    },
  })

  if (projectIds !== undefined) {
    await prisma.experienceProject.deleteMany({
      where: { experienceId },
    })

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

  if (skillIds !== undefined) {
    await prisma.experienceSkill.deleteMany({
      where: { experienceId },
    })

    if (skillIds.length > 0) {
      const userSkills = await prisma.skill.findMany({
        where: {
          userId,
          id: { in: skillIds },
        },
      })

      if (userSkills.length !== skillIds.length) {
        throw new Error('One or more skills not found')
      }

      try {
        await prisma.experienceSkill.createMany({
          data: skillIds.map((skillId) => ({
            experienceId: experience.id,
            skillId,
          })),
          skipDuplicates: true,
        })
      } catch (error: any) {
        if (error?.message?.includes('does not exist')) {
          console.error('ExperienceSkill table not found. Please run: npx prisma db push')
          throw new Error('Database table missing. Please contact support.')
        }
        throw error
      }
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

