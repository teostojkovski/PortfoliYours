

export interface UserProfile {
  id: string
  email: string
  fullName: string
  dateOfBirth: Date
  county: string
  avatar?: string | null
}

export interface CVData {
  fileName: string
  fileUrl: string
  fileSize: number
  mimeType: string
}

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

export interface ExperienceData {
  title: string
  company: string
  location?: string | null
  description?: string | null
  startDate: Date
  endDate?: Date | null
  isCurrent: boolean
}

export interface ApplicationData {
  jobTitle: string
  company: string
  location?: string | null
  status: 'applied' | 'interview' | 'offer' | 'rejected' | 'withdrawn'
  appliedDate: Date
  notes?: string | null
  jobUrl?: string | null
}

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

