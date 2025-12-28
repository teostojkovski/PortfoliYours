/**
 * Skill Form Component
 * Modal form for adding/editing skills
 */

'use client'

import { useState, useTransition } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import styles from './skill-form.module.css'

interface Skill {
  id: string
  name: string
  categoryId: string
  level: number
  yearsExperience: number | null
  description: string | null
  lastUsedAt: Date | null
  projectSkills: Array<{ id: string; projectId: string }>
}

interface Category {
  id: string
  name: string
}

interface SkillFormProps {
  skill?: Skill | null
  categories: Category[]
  onClose: () => void
  onSuccess: () => void
}

export function SkillForm({ skill, categories, onClose, onSuccess }: SkillFormProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: skill?.name || '',
    categoryId: skill?.categoryId || categories[0]?.id || '',
    level: skill?.level || 3,
    yearsExperience: skill?.yearsExperience?.toString() || '',
    description: skill?.description || '',
    lastUsedAt: skill?.lastUsedAt ? new Date(skill.lastUsedAt).toISOString().split('T')[0] : '',
    projectIds: skill?.projectSkills.map((ps) => ps.projectId) || [],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    startTransition(async () => {
      try {
        const payload = {
          ...formData,
          yearsExperience: formData.yearsExperience ? parseInt(formData.yearsExperience) : null,
          lastUsedAt: formData.lastUsedAt || null,
        }

        const url = skill ? `/api/skills/${skill.id}` : '/api/skills'
        const method = skill ? 'PUT' : 'POST'

        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.error || 'Failed to save skill')
          return
        }

        onSuccess()
        onClose()
      } catch (err) {
        setError('An error occurred. Please try again.')
      }
    })
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <Card className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{skill ? 'Edit Skill' : 'Add Skill'}</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formField}>
            <Label htmlFor="name">Skill name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="React"
              required
              maxLength={100}
            />
          </div>

          <div className={styles.formField}>
            <Label htmlFor="categoryId">Category</Label>
            <select
              id="categoryId"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className={styles.select}
              required
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formField}>
            <Label htmlFor="level">Proficiency</Label>
            <div className={styles.levelSelector}>
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  type="button"
                  className={`${styles.levelButton} ${formData.level === level ? styles.levelButtonActive : ''}`}
                  onClick={() => setFormData({ ...formData, level })}
                >
                  {'★'.repeat(level) + '☆'.repeat(5 - level)}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.formField}>
            <Label htmlFor="yearsExperience">Years experience</Label>
            <Input
              id="yearsExperience"
              type="number"
              min="0"
              max="50"
              value={formData.yearsExperience}
              onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
              placeholder="3"
            />
          </div>

          <div className={styles.formField}>
            <Label htmlFor="description">Description (optional)</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Optional description..."
              className={styles.textarea}
              rows={3}
              maxLength={500}
            />
          </div>

          <div className={styles.formField}>
            <Label htmlFor="lastUsedAt">Last used (optional)</Label>
            <Input
              id="lastUsedAt"
              type="date"
              value={formData.lastUsedAt}
              onChange={(e) => setFormData({ ...formData, lastUsedAt: e.target.value })}
            />
          </div>

          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          <div className={styles.formActions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

