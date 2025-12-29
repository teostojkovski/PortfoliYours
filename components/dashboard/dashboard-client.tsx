

'use client'

import Link from 'next/link'
import { Check, X } from 'lucide-react'
import { Card } from '@/components/ui/card'
import styles from '@/app/dashboard/dashboard-page.module.css'
import { ProfileCompleteness } from '@/lib/services/dashboard'

interface DashboardData {
  profile: {
    avatarUrl: string | null
    title: string | null
    bio: string | null
    location: string | null
  } | null
  topProjects: Array<{
    id: string
    title: string
    description: string | null
    type: string
  }>
  recentExperience: {
    id: string
    company: string
    role: string
    startDate: Date
    endDate: Date | null
  } | null
  completeness: ProfileCompleteness
}

interface DashboardClientProps {
  userName: string
  dashboardData: DashboardData
}

export function DashboardClient({ userName, dashboardData }: DashboardClientProps) {
  const { completeness, topProjects, recentExperience } = dashboardData

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date
    return new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  const formatDateRange = (startDate: Date | string, endDate: Date | string | null) => {
    const start = formatDate(startDate)
    if (!endDate) {
      return `${start} – Present`
    }
    const end = formatDate(endDate)
    return `${start} – ${end}`
  }

  const suggestions: Array<{ text: string; completed: boolean }> = []
  
  if (!completeness.hasProfilePicture || !completeness.hasProfileDetails) {
    suggestions.push({
      text: 'Add profile picture and complete your profile details (title, bio, location)',
      completed: false,
    })
  } else {
    suggestions.push({
      text: 'Profile picture and details completed',
      completed: true,
    })
  }

  if (!completeness.hasProjects) {
    suggestions.push({
      text: 'Add at least one project to showcase your work',
      completed: false,
    })
  } else {
    suggestions.push({
      text: 'Projects added',
      completed: true,
    })
  }

  if (!completeness.hasSkills) {
    suggestions.push({
      text: 'Add at least one skill to highlight your abilities',
      completed: false,
    })
  } else {
    suggestions.push({
      text: 'Skills added',
      completed: true,
    })
  }

  if (!completeness.hasExperience) {
    suggestions.push({
      text: 'Add at least one work experience',
      completed: false,
    })
  } else {
    suggestions.push({
      text: 'Experience added',
      completed: true,
    })
  }

  return (
    <div className={styles.dashboardPage}>
      {}
      <section className={styles.welcomeSection}>
        <h1 className={styles.welcomeTitle}>Welcome, {userName}</h1>
        <div className={styles.profileCompleteness}>
          <span className={styles.completenessLabel}>Profile completeness:</span>
          <span className={styles.completenessValue}>{completeness.percentage}%</span>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${completeness.percentage}%` }}
            />
          </div>
        </div>
      </section>

      {}
      <section className={styles.quickAccess}>
        <Link href="/dashboard/profile" className={styles.completionCardLink}>
          <Card className={`${styles.completionCard} ${completeness.hasProfilePicture && completeness.hasProfileDetails ? styles.completed : ''}`}>
            <div className={styles.completionCardHeader}>
              <h3 className={styles.completionCardTitle}>Profile Picture & Details</h3>
              {completeness.hasProfilePicture && completeness.hasProfileDetails ? (
                <Check className={styles.checkIcon} size={20} />
              ) : (
                <X className={styles.xIcon} size={20} />
              )}
            </div>
            <p className={styles.completionCardDesc}>
              {completeness.hasProfilePicture && completeness.hasProfileDetails
                ? 'Profile picture and details completed'
                : 'Add profile picture, title, bio, and location'}
            </p>
          </Card>
        </Link>

        <Link href="/dashboard/projects" className={styles.completionCardLink}>
          <Card className={`${styles.completionCard} ${completeness.hasProjects ? styles.completed : ''}`}>
            <div className={styles.completionCardHeader}>
              <h3 className={styles.completionCardTitle}>Projects</h3>
              {completeness.hasProjects ? (
                <Check className={styles.checkIcon} size={20} />
              ) : (
                <X className={styles.xIcon} size={20} />
              )}
            </div>
            <p className={styles.completionCardDesc}>
              {completeness.hasProjects
                ? 'Projects added'
                : 'Add at least one project'}
            </p>
          </Card>
        </Link>

        <Link href="/dashboard/skills" className={styles.completionCardLink}>
          <Card className={`${styles.completionCard} ${completeness.hasSkills ? styles.completed : ''}`}>
            <div className={styles.completionCardHeader}>
              <h3 className={styles.completionCardTitle}>Skills</h3>
              {completeness.hasSkills ? (
                <Check className={styles.checkIcon} size={20} />
              ) : (
                <X className={styles.xIcon} size={20} />
              )}
            </div>
            <p className={styles.completionCardDesc}>
              {completeness.hasSkills
                ? 'Skills added'
                : 'Add at least one skill'}
            </p>
          </Card>
        </Link>

        <Link href="/dashboard/experience" className={styles.completionCardLink}>
          <Card className={`${styles.completionCard} ${completeness.hasExperience ? styles.completed : ''}`}>
            <div className={styles.completionCardHeader}>
              <h3 className={styles.completionCardTitle}>Experience</h3>
              {completeness.hasExperience ? (
                <Check className={styles.checkIcon} size={20} />
              ) : (
                <X className={styles.xIcon} size={20} />
              )}
            </div>
            <p className={styles.completionCardDesc}>
              {completeness.hasExperience
                ? 'Experience added'
                : 'Add at least one work experience'}
            </p>
          </Card>
        </Link>
      </section>

      {}
      {(topProjects.length > 0 || recentExperience) && (
        <section className={styles.highlightsSection}>
          <h2 className={styles.sectionTitle}>Highlights</h2>
          <div className={styles.highlightsGrid}>
            {topProjects.length > 0 && (
              <Card className={styles.highlightCard}>
                <h3 className={styles.highlightCardTitle}>Top {topProjects.length} Project{topProjects.length !== 1 ? 's' : ''}</h3>
                <ul className={styles.highlightList}>
                  {topProjects.map((project) => (
                    <li key={project.id}>
                      <Link href="/dashboard/projects" className={styles.projectLink}>
                        {project.title} - {project.type.charAt(0).toUpperCase() + project.type.slice(1)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
            {recentExperience && (
              <Card className={styles.highlightCard}>
                <h3 className={styles.highlightCardTitle}>Most Recent Experience</h3>
                <div className={styles.experienceItem}>
                  <p className={styles.experienceRole}>{recentExperience.role}</p>
                  <p className={styles.experienceCompany}>{recentExperience.company}</p>
                  <p className={styles.experienceDuration}>
                    {formatDateRange(recentExperience.startDate, recentExperience.endDate)}
                  </p>
                </div>
              </Card>
            )}
          </div>
        </section>
      )}

      {}
      <section className={styles.suggestionsSection}>
        <h2 className={styles.sectionTitle}>Suggestions</h2>
        <Card className={styles.suggestionCard}>
          <ul className={styles.suggestionList}>
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className={`${styles.suggestionItem} ${suggestion.completed ? styles.suggestionCompleted : styles.suggestionPending}`}
              >
                {suggestion.completed ? '✅' : '⚠️'} {suggestion.text}
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </div>
  )
}

