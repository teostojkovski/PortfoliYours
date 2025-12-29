import { prisma } from '@/lib/prisma'
import { portfolioItemSchema, portfolioItemUpdateSchema } from '@/lib/validations/portfolio'
import { z } from 'zod'

export async function getPortfolioItemsByUserId(userId: string, type?: string) {
  return await prisma.portfolioItem.findMany({
    where: {
      userId,
      ...(type && { type }),
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getPortfolioItemById(portfolioItemId: string, userId: string) {
  const portfolioItem = await prisma.portfolioItem.findFirst({
    where: { id: portfolioItemId, userId },
  })

  if (!portfolioItem) {
    return null
  }

  const projectSkills = await prisma.projectSkill.findMany({
    where: {
      projectId: portfolioItemId,
      projectType: 'portfolio',
    },
    select: {
      skillId: true,
    },
  })

  return {
    ...portfolioItem,
    projectSkills,
  }
}

export async function createPortfolioItem(
  userId: string,
  data: z.infer<typeof portfolioItemSchema>
) {
  const validatedData = portfolioItemSchema.parse(data)
  const { skillIds, ...portfolioData } = validatedData

  const portfolioItem = await prisma.portfolioItem.create({
    data: {
      title: portfolioData.title,
      description: portfolioData.description || null,
      detailedDescription: portfolioData.detailedDescription || null,
      type: portfolioData.type,
      url: portfolioData.url || null,
      tags: portfolioData.tags || [],
      isPublished: portfolioData.isPublished,
      startDate: portfolioData.startDate ? new Date(portfolioData.startDate) : null,
      endDate: portfolioData.endDate ? new Date(portfolioData.endDate) : null,
      order: portfolioData.order || 0,
      userId,
    },
  })

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

    await prisma.projectSkill.createMany({
      data: skillIds.map((skillId) => ({
        skillId,
        projectId: portfolioItem.id,
        projectType: 'portfolio',
      })),
      skipDuplicates: true,
    })
  }

  return portfolioItem
}

export async function updatePortfolioItem(
  portfolioItemId: string,
  userId: string,
  data: z.infer<typeof portfolioItemUpdateSchema>
) {
  const validatedData = portfolioItemUpdateSchema.parse(data)
  const { skillIds, ...portfolioData } = validatedData

  const existing = await prisma.portfolioItem.findFirst({
    where: { id: portfolioItemId, userId },
  })

  if (!existing) {
    throw new Error('Project not found')
  }

  const portfolioItem = await prisma.portfolioItem.update({
    where: { id: portfolioItemId },
    data: {
      ...(portfolioData.title !== undefined && { title: portfolioData.title }),
      ...(portfolioData.description !== undefined && {
        description: portfolioData.description || null,
      }),
      ...(portfolioData.detailedDescription !== undefined && {
        detailedDescription: portfolioData.detailedDescription || null,
      }),
      ...(portfolioData.type !== undefined && { type: portfolioData.type }),
      ...(portfolioData.url !== undefined && { url: portfolioData.url || null }),
      ...(portfolioData.tags !== undefined && { tags: portfolioData.tags }),
      ...(portfolioData.isPublished !== undefined && { isPublished: portfolioData.isPublished }),
      ...(portfolioData.startDate !== undefined && {
        startDate: portfolioData.startDate ? new Date(portfolioData.startDate) : null,
      }),
      ...(portfolioData.endDate !== undefined && {
        endDate: portfolioData.endDate ? new Date(portfolioData.endDate) : null,
      }),
      ...(portfolioData.order !== undefined && { order: portfolioData.order }),
    },
  })

  if (skillIds !== undefined) {
    await prisma.projectSkill.deleteMany({
      where: {
        projectId: portfolioItemId,
        projectType: 'portfolio',
      },
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

      await prisma.projectSkill.createMany({
        data: skillIds.map((skillId) => ({
          skillId,
          projectId: portfolioItemId,
          projectType: 'portfolio',
        })),
        skipDuplicates: true,
      })
    }
  }

  return portfolioItem
}

export async function deletePortfolioItem(portfolioItemId: string, userId: string) {
  const portfolioItem = await prisma.portfolioItem.findFirst({
    where: { id: portfolioItemId, userId },
  })

  if (!portfolioItem) {
    throw new Error('Project not found')
  }

  await prisma.portfolioItem.delete({
    where: { id: portfolioItemId },
  })
}

