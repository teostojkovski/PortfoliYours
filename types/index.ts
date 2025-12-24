/**
 * Type Definitions
 * Shared TypeScript interfaces and types used throughout the application
 * These types correspond to the Prisma schema models
 */

// User types
export interface UserProfile {
  id: string
  email: string
  fullName: string
  dateOfBirth: Date
  county: string
  avatar?: string | null
}

// CV types
export interface CVData {
  fileName: string
  fileUrl: string
  fileSize: number
  mimeType: string
}

// GitHub Project types
export interface GitHubProjectData {
  name: string
  description?: string | null
  url: string
  repositoryUrl: string
  language?: string | null
  stars: number
  forks: number
  isPublic: boolean
}

// Upwork Project types
export interface UpworkProjectData {
  title: string
  description?: string | null
  clientName?: string | null
  startDate?: Date | null
  endDate?: Date | null
  status: 'active' | 'completed' | 'cancelled'
  hourlyRate?: number | null
  totalEarnings?: number | null
  url?: string | null
}

// Experience types
export interface ExperienceData {
  title: string
  company: string
  location?: string | null
  description?: string | null
  startDate: Date
  endDate?: Date | null
  isCurrent: boolean
}

// Application types
export interface ApplicationData {
  jobTitle: string
  company: string
  location?: string | null
  status: 'applied' | 'interview' | 'offer' | 'rejected' | 'withdrawn'
  appliedDate: Date
  notes?: string | null
  jobUrl?: string | null
}

// Portfolio types
export interface PortfolioItemData {
  title: string
  description?: string | null
  type: 'project' | 'experience' | 'achievement' | 'certification'
  imageUrl?: string | null
  url?: string | null
  tags: string[]
  isPublished: boolean
  order: number
}

