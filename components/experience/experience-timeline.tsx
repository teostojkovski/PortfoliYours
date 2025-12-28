/**
 * Experience Timeline Component
 * Displays experiences in chronological order
 */

'use client'

import { Card } from '@/components/ui/card'
import styles from './experience-timeline.module.css'

interface Experience {
  id: string
  company: string
  role: string
  employmentType: string
  location: string | null
  startDate: Date
  endDate: Date | null
  bullets: string[]
  experienceProjects: Array<{
    id: string
    projectId: string
    projectType: string
  }>
}

interface ExperienceTimelineProps {
  experiences: Experience[]
  onEdit?: (experience: Experience) => void
}

export function ExperienceTimeline({ experiences, onEdit }: ExperienceTimelineProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  const formatDateRange = (startDate: Date, endDate: Date | null) => {
    const start = formatDate(startDate)
    if (!endDate) {
      return `${start} — Present`
    }
    const end = formatDate(endDate)
    return `${start} — ${end}`
  }

  const groupByYear = () => {
    const grouped: Record<string, Experience[]> = {}
    
    experiences.forEach((exp) => {
      const year = new Date(exp.startDate).getFullYear()
      if (!grouped[year]) {
        grouped[year] = []
      }
      grouped[year].push(exp)
    })

    return Object.entries(grouped).sort(([a], [b]) => parseInt(b) - parseInt(a))
  }

  if (experiences.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No experience entries yet. Add your first experience to get started.</p>
      </div>
    )
  }

  const grouped = groupByYear()

  return (
    <div className={styles.timeline}>
      {grouped.map(([year, yearExperiences]) => (
        <div key={year} className={styles.yearGroup}>
          <h2 className={styles.yearTitle}>{year}</h2>
          {yearExperiences.map((experience) => (
            <Card
              key={experience.id}
              className={styles.experienceCard}
              onClick={() => onEdit?.(experience)}
              style={{ cursor: onEdit ? 'pointer' : 'default' }}
            >
              <div className={styles.experienceHeader}>
                <div className={styles.experienceTitle}>
                  <h3 className={styles.role}>{experience.role}</h3>
                  <div className={styles.companyInfo}>
                    <span className={styles.company}>{experience.company}</span>
                    <span className={styles.separator}>·</span>
                    <span className={styles.employmentType}>{experience.employmentType}</span>
                    {experience.location && (
                      <>
                        <span className={styles.separator}>·</span>
                        <span className={styles.location}>{experience.location}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className={styles.dateRange}>
                  {experience.endDate ? null : (
                    <span className={styles.presentBadge}>Present</span>
                  )}
                  <span className={styles.dates}>{formatDateRange(experience.startDate, experience.endDate)}</span>
                </div>
              </div>

              {experience.bullets.length > 0 && (
                <ul className={styles.bullets}>
                  {experience.bullets.map((bullet, index) => (
                    <li key={index}>{bullet}</li>
                  ))}
                </ul>
              )}

              {experience.experienceProjects.length > 0 && (
                <div className={styles.linkedProjects}>
                  <span className={styles.linkedProjectsLabel}>Linked projects:</span>
                  <span className={styles.linkedProjectsList}>
                    {experience.experienceProjects.map((ep, idx) => (
                      <span key={ep.id}>
                        {ep.projectId}
                        {idx < experience.experienceProjects.length - 1 && ', '}
                      </span>
                    ))}
                  </span>
                </div>
              )}
            </Card>
          ))}
        </div>
      ))}
    </div>
  )
}

