import { z } from 'zod'

export const applicationSchema = z.object({
  company: z.string().min(1, 'Company is required').max(200, 'Company name must be less than 200 characters'),
  role: z.string().min(1, 'Role is required').max(200, 'Role must be less than 200 characters'),
  location: z.string().max(200, 'Location must be less than 200 characters').optional().or(z.literal('')),
  status: z.enum(['draft', 'applied', 'interview', 'offer', 'rejected', 'withdrawn']),
  appliedAt: z.string().optional().nullable().transform((str) => str ? new Date(str) : null),
  link: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  notes: z.string().max(2000, 'Notes must be less than 2000 characters').optional().or(z.literal('')),
  recruiterName: z.string().max(200, 'Recruiter name must be less than 200 characters').optional().or(z.literal('')),
  recruiterEmail: z.string().email('Invalid email').optional().or(z.literal('')),
  followUpAt: z.string().optional().nullable().transform((str) => str ? new Date(str) : null),
  cvDocumentId: z.string().optional().nullable(),
  coverLetterDocumentId: z.string().optional().nullable(),
  saveCvToDocuments: z.boolean().default(false),
  saveCoverLetterToDocuments: z.boolean().default(false),
})

export const applicationUpdateSchema = applicationSchema.extend({
  isArchived: z.boolean().default(false),
}).partial()

