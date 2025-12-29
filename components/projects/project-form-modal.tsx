

'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { DatePicker } from '@/components/ui/date-picker'
import styles from './project-form-modal.module.css'

interface Project {
  id: string
  title: string
  description: string | null
  detailedDescription: string | null
  type: string
  url: string | null
  tags: string[]
  isPublished: boolean
  startDate: Date | null
  endDate: Date | null
  createdAt: Date
  updatedAt: Date
  skillIds?: string[]
}

interface Skill {
  id: string
  name: string
  category: {
    name: string
  }
}

interface ProjectFormModalProps {
  project: Project | null
  onClose: () => void
  onSave: (project: Project) => void
}

const PROJECT_TYPES = ['personal', 'freelance', 'client', 'company', 'academic', 'other'] as const

export function ProjectFormModal({ project, onClose, onSave }: ProjectFormModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [detailedDescription, setDetailedDescription] = useState('')
  const [type, setType] = useState<string>('personal')
  const [url, setUrl] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([])
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {

    fetch('/api/skills')
      .then(res => res.json())
      .then(data => {
        if (data.skills) {
          setAvailableSkills(data.skills)
        }
      })
      .catch(() => {

      })
  }, [])

  useEffect(() => {
    if (project) {
      setTitle(project.title)
      setDescription(project.description || '')
      setDetailedDescription(project.detailedDescription || '')
      setType(project.type)
      setUrl(project.url || '')
      setTags(project.tags || [])
      setIsPublished(project.isPublished)
      setStartDate(project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '')
      setEndDate(project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '')
      setSelectedSkillIds(project.skillIds || [])
    } else {
      setSelectedSkillIds([])
    }
  }, [project])

  const handleAddTag = () => {
    const trimmed = tagInput.trim()
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const toggleSkill = (skillId: string) => {
    setSelectedSkillIds(prev =>
      prev.includes(skillId)
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSaving(true)

    try {
      const projectData = {
        title,
        description: description || undefined,
        detailedDescription: detailedDescription || undefined,
        type,
        url: url || undefined,
        tags,
        isPublished,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        skillIds: selectedSkillIds,
      }

      const url_path = project ? `/api/portfolio/${project.id}` : '/api/portfolio'
      const method = project ? 'PUT' : 'POST'

      const response = await fetch(url_path, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save project')
      }

      const data = await response.json()
      onSave(data.project)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save project')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {project ? 'Edit Project' : 'New Project'}
          </h2>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>
              Project name <span className={styles.required}>*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="type" className={styles.label}>
              Project type <span className={styles.required}>*</span>
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={styles.select}
              required
            >
              {PROJECT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="visibility" className={styles.label}>
              Visibility
            </label>
            <div className={styles.toggleGroup}>
              <button
                type="button"
                onClick={() => setIsPublished(false)}
                className={`${styles.toggleButton} ${!isPublished ? styles.active : ''}`}
              >
                Private
              </button>
              <button
                type="button"
                onClick={() => setIsPublished(true)}
                className={`${styles.toggleButton} ${isPublished ? styles.active : ''}`}
              >
                Public
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>
              Short description (1-2 lines)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.textarea}
              rows={2}
              placeholder="Brief overview of the project"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="detailedDescription" className={styles.label}>
              Detailed description
            </label>
            <textarea
              id="detailedDescription"
              value={detailedDescription}
              onChange={(e) => setDetailedDescription(e.target.value)}
              className={styles.textarea}
              rows={5}
              placeholder="What you built, what you solved, impact..."
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="skills" className={styles.label}>
              Skills
            </label>
            <div className={styles.skillsContainer}>
              {availableSkills.length === 0 ? (
                <p className={styles.hint}>No skills available. Add skills in the Skills section first.</p>
              ) : (
                <div className={styles.skillsGrid}>
                  {availableSkills.map((skill) => (
                    <label key={skill.id} className={styles.skillCheckbox}>
                      <input
                        type="checkbox"
                        checked={selectedSkillIds.includes(skill.id)}
                        onChange={() => toggleSkill(skill.id)}
                      />
                      <span>{skill.name}</span>
                      <span className={styles.skillCategory}>{skill.category.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="tags" className={styles.label}>
              Tech stack
            </label>
            <div className={styles.tagsContainer}>
              <div className={styles.tagsInput}>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddTag()
                    }
                  }}
                  className={styles.input}
                  placeholder="Add technology and press Enter"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className={styles.addTagButton}
                >
                  Add
                </button>
              </div>
              {tags.length > 0 && (
                <div className={styles.tagsList}>
                  {tags.map((tag) => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className={styles.removeTagButton}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="url" className={styles.label}>
              External link (optional)
            </label>
            <input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className={styles.input}
              placeholder="GitHub, Live demo, Case study..."
            />
          </div>

          <div className={styles.dateRow}>
            <div className={styles.formGroup}>
              <label htmlFor="startDate" className={styles.label}>
                Start date (optional)
              </label>
              <DatePicker
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="endDate" className={styles.label}>
                End date (optional)
              </label>
              <DatePicker
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <div className={styles.formActions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button type="submit" className={styles.saveButton} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

