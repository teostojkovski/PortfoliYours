/**
 * Experience Page Client Component
 * Handles modal state and interactions
 */

'use client'

import { useState } from 'react'
import { ExperienceTimeline } from './experience-timeline'
import { ExperienceForm } from './experience-form'
import styles from './experience-page.module.css'

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

interface ExperiencePageClientProps {
  experiences: Experience[]
}

export function ExperiencePageClient({ experiences: initialExperiences }: ExperiencePageClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null)
  const [experiences, setExperiences] = useState(initialExperiences)

  const handleAddClick = () => {
    setEditingExperience(null)
    setIsModalOpen(true)
  }

  const handleEditClick = (experience: Experience) => {
    setEditingExperience(experience)
    setIsModalOpen(true)
  }

  const handleClose = () => {
    setIsModalOpen(false)
    setEditingExperience(null)
  }

  const handleSuccess = () => {
    // Reload to get fresh data
    window.location.reload()
  }

  return (
    <div className={styles.experiencePage}>
      <div className={styles.experienceHeader}>
        <div>
          <h1 className={styles.pageTitle}>Experience</h1>
          <p className={styles.pageDescription}>
            Your professional history, ordered by time
          </p>
        </div>
        <button className={styles.addButton} onClick={handleAddClick}>
          + Add Experience
        </button>
      </div>

      <ExperienceTimeline experiences={experiences} onEdit={handleEditClick} />

      {isModalOpen && (
        <ExperienceForm
          experience={editingExperience}
          onClose={handleClose}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  )
}

