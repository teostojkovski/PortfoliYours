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
  return await prisma.portfolioItem.findFirst({
    where: { id: portfolioItemId, userId },
  })
}

export async function createPortfolioItem(
  userId: string,
  data: z.infer<typeof portfolioItemSchema>
) {
  const validatedData = portfolioItemSchema.parse(data)

  const portfolioItem = await prisma.portfolioItem.create({
    data: {
      title: validatedData.title,
      description: validatedData.description || null,
      detailedDescription: validatedData.detailedDescription || null,
      type: validatedData.type,
      url: validatedData.url || null,
      tags: validatedData.tags || [],
      isPublished: validatedData.isPublished,
      startDate: validatedData.startDate ? new Date(validatedData.startDate) : null,
      endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
      order: validatedData.order || 0,
      userId,
    },
  })

  return portfolioItem
}

export async function updatePortfolioItem(
  portfolioItemId: string,
  userId: string,
  data: z.infer<typeof portfolioItemUpdateSchema>
) {
  const validatedData = portfolioItemUpdateSchema.parse(data)

  // Verify ownership
  const existing = await prisma.portfolioItem.findFirst({
    where: { id: portfolioItemId, userId },
  })

  if (!existing) {
    throw new Error('Project not found')
  }

  const portfolioItem = await prisma.portfolioItem.update({
    where: { id: portfolioItemId },
    data: {
      ...(validatedData.title !== undefined && { title: validatedData.title }),
      ...(validatedData.description !== undefined && {
        description: validatedData.description || null,
      }),
      ...(validatedData.detailedDescription !== undefined && {
        detailedDescription: validatedData.detailedDescription || null,
      }),
      ...(validatedData.type !== undefined && { type: validatedData.type }),
      ...(validatedData.url !== undefined && { url: validatedData.url || null }),
      ...(validatedData.tags !== undefined && { tags: validatedData.tags }),
      ...(validatedData.isPublished !== undefined && { isPublished: validatedData.isPublished }),
      ...(validatedData.startDate !== undefined && {
        startDate: validatedData.startDate ? new Date(validatedData.startDate) : null,
      }),
      ...(validatedData.endDate !== undefined && {
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
      }),
      ...(validatedData.order !== undefined && { order: validatedData.order }),
    },
  })

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

