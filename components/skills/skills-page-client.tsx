/**
 * Skills Page Client Component
 * Handles modal state and interactions
 */

'use client'

import { useState } from 'react'
import { SkillsList } from './skills-list'
import { SkillForm } from './skill-form'
import styles from '../dashboard/skills/skills.module.css'

interface Skill {
  id: string
  name: string
  categoryId: string
  level: number
  yearsExperience: number | null
  description: string | null
  lastUsedAt: Date | null
  projectSkills: Array<{ id: string; projectId: string }>
  category: {
    id: string
    name: string
  }
}

interface Category {
  id: string
  name: string
  order: number
}

interface SkillsPageClientProps {
  grouped: Record<string, Skill[]>
  categories: Category[]
  skillsWithoutProjects: number
  oldSkills: number
}

export function SkillsPageClient({
  grouped,
  categories,
  skillsWithoutProjects,
  oldSkills,
}: SkillsPageClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleAddClick = () => {
    setEditingSkill(null)
    setIsModalOpen(true)
  }

  const handleEditClick = (skill: Skill) => {
    setEditingSkill(skill)
    setIsModalOpen(true)
  }

  const handleClose = () => {
    setIsModalOpen(false)
    setEditingSkill(null)
  }

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1)
    // In a real app, you'd refetch data here or use React Query
    window.location.reload()
  }

  return (
    <div className={styles.skillsPage}>
      <div className={styles.skillsHeader}>
        <div>
          <h1 className={styles.pageTitle}>Skills</h1>
          <p className={styles.pageDescription}>
            Skills are reusable across projects & CVs
          </p>
        </div>
        <button className={styles.addButton} onClick={handleAddClick}>
          + Add Skill
        </button>
      </div>

      {/* Warnings */}
      {(skillsWithoutProjects > 0 || oldSkills > 0) && (
        <div className={styles.warningsSection}>
          {skillsWithoutProjects > 0 && (
            <div className={styles.warning}>
              ⚠️ {skillsWithoutProjects} skill{skillsWithoutProjects > 1 ? 's' : ''} have no linked projects
            </div>
          )}
          {oldSkills > 0 && (
            <div className={styles.warning}>
              ⚠️ {oldSkills} skill{oldSkills > 1 ? 's' : ''} have not been used in 3+ years
            </div>
          )}
        </div>
      )}

      <SkillsList grouped={grouped} categories={categories} onEdit={handleEditClick} />

      {isModalOpen && (
        <SkillForm
          skill={editingSkill}
          categories={categories}
          onClose={handleClose}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  )
}

