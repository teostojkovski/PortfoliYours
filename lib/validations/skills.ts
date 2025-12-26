import { z } from 'zod'

export const skillSchema = z.object({
  name: z.string().min(1, 'Skill name is required').max(100, 'Skill name must be less than 100 characters'),
  categoryId: z.string().min(1, 'Category is required'),
  level: z.number().int().min(1, 'Level must be between 1 and 5').max(5, 'Level must be between 1 and 5'),
  yearsExperience: z.number().int().min(0).max(50).optional().nullable(),
  description: z.string().max(500, 'Description must be less than 500 characters').optional().or(z.literal('')),
  lastUsedAt: z.string().optional().nullable().transform((str) => str ? new Date(str) : null),
  projectIds: z.array(z.string()).optional().default([]),
})

export const skillCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(50, 'Category name must be less than 50 characters'),
  order: z.number().int().min(0).default(0),
})

