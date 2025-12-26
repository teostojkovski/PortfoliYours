/**
 * Skills List Component
 * Displays skills grouped by category
 */

'use client'

import { Card } from '@/components/ui/card'
import styles from './skills-list.module.css'

interface Skill {
  id: string
  name: string
  level: number
  yearsExperience: number | null
  description: string | null
  lastUsedAt: Date | null
  projectSkills: Array<{ id: string }>
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

interface SkillsListProps {
  grouped: Record<string, Skill[]>
  categories: Category[]
  onEdit?: (skill: Skill) => void
}

export function SkillsList({ grouped, categories, onEdit }: SkillsListProps) {
  const renderStars = (level: number) => {
    return '★'.repeat(level) + '☆'.repeat(5 - level)
  }

  const getStatusIndicator = (skill: Skill) => {
    if (skill.projectSkills.length > 0) {
      return <span className={styles.statusVerified}>🟢 Verified</span>
    }
    return <span className={styles.statusClaimed}>🟡 Claimed</span>
  }

  return (
    <div className={styles.skillsList}>
      {categories.map((category) => {
        const categorySkills = grouped[category.id] || []
        if (categorySkills.length === 0) return null

        return (
          <Card key={category.id} className={styles.categoryCard}>
            <h2 className={styles.categoryTitle}>{category.name}</h2>
            <div className={styles.skillsTable}>
              <div className={styles.tableHeader}>
                <div className={styles.colName}>Skill</div>
                <div className={styles.colLevel}>Level</div>
                <div className={styles.colYears}>Years</div>
                <div className={styles.colProjects}>Projects</div>
                <div className={styles.colStatus}>Status</div>
              </div>
              {categorySkills.map((skill) => (
                <div
                  key={skill.id}
                  className={styles.skillRow}
                  onClick={() => onEdit?.(skill)}
                  style={{ cursor: onEdit ? 'pointer' : 'default' }}
                >
                  <div className={styles.colName}>
                    <span className={styles.skillName}>{skill.name}</span>
                  </div>
                  <div className={styles.colLevel}>
                    <span className={styles.stars}>{renderStars(skill.level)}</span>
                  </div>
                  <div className={styles.colYears}>
                    {skill.yearsExperience ? `${skill.yearsExperience} yrs` : '-'}
                  </div>
                  <div className={styles.colProjects}>
                    {skill.projectSkills.length} project{skill.projectSkills.length !== 1 ? 's' : ''}
                  </div>
                  <div className={styles.colStatus}>
                    {getStatusIndicator(skill)}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )
      })}
    </div>
  )
}

