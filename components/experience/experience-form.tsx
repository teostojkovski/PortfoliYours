'use client'

import { useState, useTransition, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import styles from './experience-form.module.css'

interface Experience {
  id: string
  company: string
  role: string
  employmentType: string
  location: string | null
  startDate: Date
  endDate: Date | null
  bullets: string[]
  experienceProjects: Array<{ id: string; projectId: string }>
  experienceSkills?: Array<{ skillId: string }>
}

interface Skill {
  id: string
  name: string
  category: {
    name: string
  }
}

interface ExperienceFormProps {
  experience?: Experience | null
  onClose: () => void
  onSuccess: () => void
}

export function ExperienceForm({ experience, onClose, onSuccess }: ExperienceFormProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([])
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([])

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

  const formatDateForInput = (date: Date | null) => {
    if (!date) return ''
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    return `${year}-${month}-01`
  }

  const [formData, setFormData] = useState({
    company: experience?.company || '',
    role: experience?.role || '',
    employmentType: experience?.employmentType || 'Full-time',
    location: experience?.location || '',
    startDate: formatDateForInput(experience?.startDate || null),
    endDate: experience?.endDate ? formatDateForInput(experience.endDate) : '',
    isPresent: !experience?.endDate,
    bullets: experience?.bullets || [''],
    projectIds: experience?.experienceProjects.map((ep) => ep.projectId) || [],
    skillIds: experience?.experienceSkills?.map((es) => es.skillId) || [],
  })

  useEffect(() => {
    if (experience) {
      setSelectedSkillIds(experience.experienceSkills?.map((es) => es.skillId) || [])
    } else {
      setSelectedSkillIds([])
    }
  }, [experience])

  const handleAddBullet = () => {
    setFormData({ ...formData, bullets: [...formData.bullets, ''] })
  }

  const handleRemoveBullet = (index: number) => {
    if (formData.bullets.length > 1) {
      setFormData({
        ...formData,
        bullets: formData.bullets.filter((_, i) => i !== index),
      })
    }
  }

  const handleBulletChange = (index: number, value: string) => {
    const newBullets = [...formData.bullets]
    newBullets[index] = value
    setFormData({ ...formData, bullets: newBullets })
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

    const validBullets = formData.bullets.filter((b) => b.trim().length > 0)

    if (validBullets.length === 0) {
      setError('At least one responsibility/achievement is required')
      return
    }

    startTransition(async () => {
      try {
        const payload = {
          ...formData,
          bullets: validBullets,
          endDate: formData.isPresent ? null : formData.endDate,
          skillIds: selectedSkillIds,
        }

        const url = experience ? `/api/experience/${experience.id}` : '/api/experience'
        const method = experience ? 'PUT' : 'POST'

        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.error || 'Failed to save experience')
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
          <h2 className={styles.modalTitle}>{experience ? 'Edit Experience' : 'Add Experience'}</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.formField}>
              <Label htmlFor="company">Company / Platform</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Startup X"
                required
                maxLength={200}
              />
            </div>

            <div className={styles.formField}>
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="Frontend Developer"
                required
                maxLength={200}
              />
            </div>

            <div className={styles.formField}>
              <Label htmlFor="employmentType">Employment type</Label>
              <select
                id="employmentType"
                value={formData.employmentType}
                onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                className={styles.select}
                required
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div className={styles.formField}>
              <Label htmlFor="location">Location (optional)</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="City, Country"
                maxLength={200}
              />
            </div>

            <div className={styles.formField}>
              <Label htmlFor="startDate">Start date</Label>
              <DatePicker
                id="startDate"
                type="month"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>

            <div className={styles.formField}>
              <Label htmlFor="endDate">End date</Label>
              <div className={styles.endDateGroup}>
                <DatePicker
                  id="endDate"
                  type="month"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value, isPresent: false })}
                  disabled={formData.isPresent}
                />
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.isPresent}
                    onChange={(e) => setFormData({ ...formData, isPresent: e.target.checked, endDate: '' })}
                  />
                  <span>Present</span>
                </label>
              </div>
            </div>
          </div>

          <div className={styles.formFieldFull}>
            <Label>Skills</Label>
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

          <div className={styles.formFieldFull}>
            <Label>Responsibilities & Achievements</Label>
            <div className={styles.bulletsContainer}>
              {formData.bullets.map((bullet, index) => (
                <div key={index} className={styles.bulletRow}>
                  <span className={styles.bulletMarker}>•</span>
                  <Input
                    value={bullet}
                    onChange={(e) => handleBulletChange(index, e.target.value)}
                    placeholder="e.g. Led frontend architecture for core platform"
                    maxLength={500}
                  />
                  {formData.bullets.length > 1 && (
                    <button
                      type="button"
                      className={styles.removeBullet}
                      onClick={() => handleRemoveBullet(index)}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className={styles.addBulletButton}
                onClick={handleAddBullet}
              >
                + Add bullet
              </button>
            </div>
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

