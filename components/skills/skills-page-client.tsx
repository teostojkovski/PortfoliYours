

'use client'

import { useState } from 'react'
import { SkillsList } from './skills-list'
import { SkillForm } from './skill-form'
import styles from '@/app/dashboard/skills/skills.module.css'

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

    window.location.reload()
  }

  return (
    <div className={styles.skillsPage}>
      <div className={styles.skillsHeader}>
        <div>
          <p className={styles.pageDescription}>
            Skills are reusable across projects & CVs
          </p>
        </div>
        <button className={styles.addButton} onClick={handleAddClick}>
          + Add Skill
        </button>
      </div>

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

