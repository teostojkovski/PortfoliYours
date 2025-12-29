import { z } from 'zod'

export const portfolioItemSchema = z.object({
  title: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  detailedDescription: z.string().optional(),
  type: z.enum(['personal', 'freelance', 'client', 'company', 'academic', 'other'], {
    errorMap: () => ({ message: 'Invalid project type' }),
  }),
  url: z.string().url('Invalid URL').optional().or(z.literal('')),
  tags: z.array(z.string()).default([]),
  isPublished: z.boolean().default(false),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  order: z.number().int().default(0),
  skillIds: z.array(z.string()).optional().default([]),
})

export const portfolioItemUpdateSchema = portfolioItemSchema.partial().extend({
  title: z.string().min(1, 'Project name is required').optional(),
})

