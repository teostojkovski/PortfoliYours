import { z } from 'zod'

export const profileUpdateSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(100, 'Full name too long'),
  title: z.string().max(100, 'Title too long').optional().or(z.literal('')),
  bio: z.string().max(500, 'Bio too long (max 500 characters)').optional().or(z.literal('')),
  location: z.string().max(100, 'Location too long').optional().or(z.literal('')),
  phone: z.string().max(20, 'Phone too long').optional().or(z.literal('')),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  github: z.string().url('Invalid URL').optional().or(z.literal('')),
  linkedin: z.string().url('Invalid URL').optional().or(z.literal('')),
  otherLink: z.string().url('Invalid URL').optional().or(z.literal('')),
  otherLinkLabel: z.string().max(50, 'Label too long').optional().or(z.literal('')),
  isPublic: z.boolean().default(false),
})

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>

