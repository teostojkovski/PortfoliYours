import { z } from 'zod'

export const profileUpdateSchema = z.object({
  title: z.string().max(100, 'Title must be less than 100 characters').optional().or(z.literal('')),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional().or(z.literal('')),
  location: z.string().max(200, 'Location must be less than 200 characters').optional().or(z.literal('')),
  phone: z.string().max(20, 'Phone must be less than 20 characters').optional().or(z.literal('')),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  github: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  linkedin: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  otherLink: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  otherLabel: z.string().max(50, 'Label must be less than 50 characters').optional().or(z.literal('')),
  isPublic: z.boolean().default(false),
})

