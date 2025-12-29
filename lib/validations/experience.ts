import { z } from 'zod'

export const experienceSchema = z.object({
  company: z.string().min(1, 'Company is required').max(200, 'Company name must be less than 200 characters'),
  role: z.string().min(1, 'Role is required').max(200, 'Role must be less than 200 characters'),
  employmentType: z.enum(['Full-time', 'Contract', 'Freelance', 'Internship', 'Part-time']),
  location: z.string().max(200, 'Location must be less than 200 characters').optional().or(z.literal('')),
  startDate: z.string().transform((str) => new Date(str)),
  endDate: z.string().optional().nullable().transform((str) => str ? new Date(str) : null),
  bullets: z.array(z.string().min(1, 'Bullet point cannot be empty').max(500, 'Bullet point must be less than 500 characters')).min(1, 'At least one responsibility/achievement is required'),
  projectIds: z.array(z.string()).optional().default([]),
  skillIds: z.array(z.string()).optional().default([]),
}).refine(
  (data) => {
    if (data.endDate && data.startDate) {
      return data.endDate >= data.startDate
    }
    return true
  },
  {
    message: 'End date must be after start date',
    path: ['endDate'],
  }
)

