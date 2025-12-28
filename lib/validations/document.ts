import { z } from 'zod'

export const documentSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name must be less than 200 characters'),
  type: z.enum(['CV', 'COVER_LETTER', 'OTHER']),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional().or(z.literal('')),
})

export const documentUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name must be less than 200 characters'),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional().or(z.literal('')),
})

