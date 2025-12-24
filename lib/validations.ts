import { z } from 'zod'

// Auth validations
export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(1, 'Full name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  county: z.string().min(1, 'County is required'),
})

export const signinSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

// Profile validations (legacy - use profile.ts instead)
export const profileUpdateSchema = z.object({
  bio: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  linkedin: z.string().url('Invalid URL').optional().or(z.literal('')),
  twitter: z.string().url('Invalid URL').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
})

// CV validations
export const cvUploadSchema = z.object({
  file: z.instanceof(File).refine(
    (file) => file.size <= 5 * 1024 * 1024, // 5MB
    'File size must be less than 5MB'
  ).refine(
    (file) => ['application/pdf'].includes(file.type),
    'Only PDF files are allowed'
  ),
})

// GitHub Project validations
export const githubProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  url: z.string().url('Invalid URL'),
  repositoryUrl: z.string().url('Invalid repository URL'),
  language: z.string().optional(),
  stars: z.number().int().default(0),
  forks: z.number().int().default(0),
  isPublic: z.boolean().default(true),
})

// Upwork Project validations
export const upworkProjectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  clientName: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  status: z.enum(['active', 'completed', 'cancelled']).default('active'),
  hourlyRate: z.number().positive().optional(),
  totalEarnings: z.number().positive().optional(),
  url: z.string().url('Invalid URL').optional().or(z.literal('')),
})

// Experience validations
export const experienceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  company: z.string().min(1, 'Company is required'),
  location: z.string().optional(),
  description: z.string().optional(),
  startDate: z.date(),
  endDate: z.date().optional(),
  isCurrent: z.boolean().default(false),
}).refine(
  (data) => !data.isCurrent || !data.endDate,
  'End date should not be set for current positions'
)

// Application validations
export const applicationSchema = z.object({
  jobTitle: z.string().min(1, 'Job title is required'),
  company: z.string().min(1, 'Company is required'),
  location: z.string().optional(),
  status: z.enum(['applied', 'interview', 'offer', 'rejected', 'withdrawn']).default('applied'),
  appliedDate: z.date().default(new Date()),
  notes: z.string().optional(),
  jobUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
})

// Portfolio Item validations
export const portfolioItemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  type: z.enum(['project', 'experience', 'achievement', 'certification']),
  imageUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  url: z.string().url('Invalid URL').optional().or(z.literal('')),
  tags: z.array(z.string()).default([]),
  isPublished: z.boolean().default(false),
  order: z.number().int().default(0),
})

