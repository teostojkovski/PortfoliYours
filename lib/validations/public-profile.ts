import { z } from 'zod'

export const publicProfileSchema = z.object({
  slug: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be less than 50 characters')
    .regex(/^[a-z0-9-]+$/, 'Username can only contain lowercase letters, numbers, and hyphens'),
  enabled: z.boolean().default(false),
  seoIndexable: z.boolean().default(false),
  showProfile: z.boolean().default(true),
  showSkills: z.boolean().default(true),
  showExperience: z.boolean().default(true),
  showProjects: z.boolean().default(true),
  showContact: z.boolean().default(false),
  allowCvRequest: z.boolean().default(false),
  selectedProjectIds: z.array(z.string()).default([]),
  selectedExperienceIds: z.array(z.string()).default([]),
  selectedCvId: z.string().nullable().optional(),
})

