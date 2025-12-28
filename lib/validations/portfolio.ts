import { z } from 'zod'

export const portfolioItemSchema = z.object({
  title: z.string().min(1, 'Project name is required'),
  description: z.string().optional(), // Short description (1-2 lines)
  detailedDescription: z.string().optional(), // Detailed description/impact
  type: z.enum(['personal', 'freelance', 'client', 'company', 'academic', 'other'], {
    errorMap: () => ({ message: 'Invalid project type' }),
  }),
  url: z.string().url('Invalid URL').optional().or(z.literal('')), // External link
  tags: z.array(z.string()).default([]), // Tech stack
  isPublished: z.boolean().default(false), // Visibility: public/private
  startDate: z.string().optional(), // ISO date string
  endDate: z.string().optional(), // ISO date string
  order: z.number().int().default(0),
})

export const portfolioItemUpdateSchema = portfolioItemSchema.partial().extend({
  title: z.string().min(1, 'Project name is required').optional(),
})

