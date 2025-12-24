/**
 * Profile Form Component
 * Client component for profile editing
 */

'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import styles from './profile-form.module.css'

interface ProfileData {
  fullName: string
  title?: string | null
  bio?: string | null
  location?: string | null
  phone?: string | null
  website?: string | null
  github?: string | null
  linkedin?: string | null
  otherLink?: string | null
  otherLinkLabel?: string | null
  isPublic: boolean
}

interface ProfileFormProps {
  initialData?: ProfileData
  userEmail: string
}

export function ProfileForm({ initialData, userEmail }: ProfileFormProps) {
  const { data: session } = useSession()
  const [formData, setFormData] = useState<ProfileData>({
    fullName: initialData?.fullName || '',
    title: initialData?.title || '',
    bio: initialData?.bio || '',
    location: initialData?.location || '',
    phone: initialData?.phone || '',
    website: initialData?.website || '',
    github: initialData?.github || '',
    linkedin: initialData?.linkedin || '',
    otherLink: initialData?.otherLink || '',
    otherLinkLabel: initialData?.otherLinkLabel || '',
    isPublic: initialData?.isPublic || false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (initialData) {
      setFormData({
        fullName: initialData.fullName || '',
        title: initialData.title || '',
        bio: initialData.bio || '',
        location: initialData.location || '',
        phone: initialData.phone || '',
        website: initialData.website || '',
        github: initialData.github || '',
        linkedin: initialData.linkedin || '',
        otherLink: initialData.otherLink || '',
        otherLinkLabel: initialData.otherLinkLabel || '',
        isPublic: initialData.isPublic || false,
      })
    }
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})
    setSuccessMessage('')

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.details) {
          const fieldErrors: Record<string, string> = {}
          data.details.forEach((error: any) => {
            fieldErrors[error.path[0]] = error.message
          })
          setErrors(fieldErrors)
        } else {
          setErrors({ general: data.error || 'Failed to update profile' })
        }
        return
      }

      setSuccessMessage('Profile updated successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      setErrors({ general: 'An error occurred. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.profileForm}>
      {successMessage && (
        <div className={styles.successMessage}>{successMessage}</div>
      )}
      {errors.general && (
        <div className={styles.errorMessage}>{errors.general}</div>
      )}

      {/* Profile Picture Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Profile Picture</h2>
        <p className={styles.sectionDescription}>Optional. Upload your profile image.</p>
        <div className={styles.avatarSection}>
          {/* TODO: Implement image upload */}
          <div className={styles.avatarPlaceholder}>Image Upload Coming Soon</div>
        </div>
      </section>

      {/* Basic Information */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Basic Information</h2>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <Label htmlFor="fullName">
              Full Name <span className={styles.required}>*</span>
            </Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
            {errors.fullName && (
              <span className={styles.fieldError}>{errors.fullName}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <Label htmlFor="title">Professional Title</Label>
            <Input
              id="title"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Frontend Developer"
            />
            {errors.title && (
              <span className={styles.fieldError}>{errors.title}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location || ''}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="City / Country"
            />
            {errors.location && (
              <span className={styles.fieldError}>{errors.location}</span>
            )}
          </div>

          <div className={styles.formGroupFull}>
            <Label htmlFor="bio">Short Bio</Label>
            <textarea
              id="bio"
              className={styles.textarea}
              value={formData.bio || ''}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              maxLength={500}
              rows={4}
              placeholder="A brief summary of yourself..."
            />
            <div className={styles.charCount}>
              {(formData.bio || '').length} / 500
            </div>
            {errors.bio && (
              <span className={styles.fieldError}>{errors.bio}</span>
            )}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Contact Information</h2>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={userEmail}
              disabled
              className={styles.disabledInput}
            />
            <p className={styles.helpText}>Email is managed through authentication</p>
          </div>

          <div className={styles.formGroup}>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 (555) 123-4567"
            />
            {errors.phone && (
              <span className={styles.fieldError}>{errors.phone}</span>
            )}
          </div>
        </div>
      </section>

      {/* Social & External Links */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Social & External Links</h2>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <Label htmlFor="website">Personal Website</Label>
            <Input
              id="website"
              type="url"
              value={formData.website || ''}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="https://yourwebsite.com"
            />
            {errors.website && (
              <span className={styles.fieldError}>{errors.website}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <Label htmlFor="github">GitHub</Label>
            <Input
              id="github"
              type="url"
              value={formData.github || ''}
              onChange={(e) => setFormData({ ...formData, github: e.target.value })}
              placeholder="https://github.com/username"
            />
            {errors.github && (
              <span className={styles.fieldError}>{errors.github}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              type="url"
              value={formData.linkedin || ''}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              placeholder="https://linkedin.com/in/username"
            />
            {errors.linkedin && (
              <span className={styles.fieldError}>{errors.linkedin}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <Label htmlFor="otherLinkLabel">Other Link Label</Label>
            <Input
              id="otherLinkLabel"
              value={formData.otherLinkLabel || ''}
              onChange={(e) => setFormData({ ...formData, otherLinkLabel: e.target.value })}
              placeholder="e.g. Twitter, Portfolio"
            />
          </div>

          <div className={styles.formGroup}>
            <Label htmlFor="otherLink">Other Link URL</Label>
            <Input
              id="otherLink"
              type="url"
              value={formData.otherLink || ''}
              onChange={(e) => setFormData({ ...formData, otherLink: e.target.value })}
              placeholder="https://..."
            />
            {errors.otherLink && (
              <span className={styles.fieldError}>{errors.otherLink}</span>
            )}
          </div>
        </div>
      </section>

      {/* Profile Visibility */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Profile Visibility</h2>
        <div className={styles.visibilitySection}>
          <label className={styles.switchLabel}>
            <input
              type="checkbox"
              checked={formData.isPublic}
              onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
              className={styles.switch}
            />
            <span className={styles.switchText}>
              Make profile public (visible at /u/[username])
            </span>
          </label>
          <p className={styles.helpText}>
            Private by default. Public profiles are visible to anyone with the link.
          </p>
        </div>
      </section>

      <div className={styles.formActions}>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}

