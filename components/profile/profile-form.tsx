/**
 * Profile Form Component
 * Client component for profile editing
 */

'use client'

import { useState, useTransition } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Profile, User } from '@prisma/client'
import styles from './profile-form.module.css'

interface ProfileFormProps {
  user: {
    id: string
    email: string
    fullName: string
    profile: {
      id: string
      title: string | null
      bio: string | null
      location: string | null
      phone: string | null
      avatarUrl: string | null
      website: string | null
      github: string | null
      linkedin: string | null
      otherLink: string | null
      otherLabel: string | null
      isPublic: boolean
    } | null
  }
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    title: user.profile?.title || '',
    bio: user.profile?.bio || '',
    location: user.profile?.location || '',
    phone: user.profile?.phone || '',
    website: user.profile?.website || '',
    github: user.profile?.github || '',
    linkedin: user.profile?.linkedin || '',
    otherLink: user.profile?.otherLink || '',
    otherLabel: user.profile?.otherLabel || '',
    isPublic: user.profile?.isPublic ?? false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    startTransition(async () => {
      try {
        const response = await fetch('/api/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.error || 'Failed to update profile')
          return
        }

        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } catch (err) {
        setError('An error occurred. Please try again.')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className={styles.profileForm}>
      {/* Basic Information */}
      <Card className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>Basic Information</h2>
        <div className={styles.formGrid}>
          <div className={styles.formField}>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={user.fullName}
              disabled
              className={styles.readOnlyInput}
            />
            <p className={styles.fieldHint}>Name cannot be changed here</p>
          </div>

          <div className={styles.formField}>
            <Label htmlFor="title">Professional Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Frontend Developer"
              maxLength={100}
            />
          </div>

          <div className={styles.formField}>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="City / Country"
              maxLength={200}
            />
          </div>

          <div className={styles.formFieldFull}>
            <Label htmlFor="bio">Short Bio</Label>
            <textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="A brief summary about yourself..."
              maxLength={500}
              className={styles.textarea}
              rows={4}
            />
            <p className={styles.charCount}>{formData.bio.length}/500</p>
          </div>
        </div>
      </Card>

      {/* Contact Information */}
      <Card className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>Contact Information</h2>
        <div className={styles.formGrid}>
          <div className={styles.formField}>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={user.email}
              disabled
              className={styles.readOnlyInput}
            />
            <p className={styles.fieldHint}>Email is read-only (auth source)</p>
          </div>

          <div className={styles.formField}>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 234 567 8900"
              maxLength={20}
            />
          </div>
        </div>
      </Card>

      {/* Social & External Links */}
      <Card className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>Social & External Links</h2>
        <div className={styles.formGrid}>
          <div className={styles.formField}>
            <Label htmlFor="website">Personal Website</Label>
            <Input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="https://yourwebsite.com"
            />
          </div>

          <div className={styles.formField}>
            <Label htmlFor="github">GitHub</Label>
            <Input
              id="github"
              type="url"
              value={formData.github}
              onChange={(e) => setFormData({ ...formData, github: e.target.value })}
              placeholder="https://github.com/username"
            />
          </div>

          <div className={styles.formField}>
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              type="url"
              value={formData.linkedin}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          <div className={styles.formField}>
            <Label htmlFor="otherLabel">Other Link Label</Label>
            <Input
              id="otherLabel"
              value={formData.otherLabel}
              onChange={(e) => setFormData({ ...formData, otherLabel: e.target.value })}
              placeholder="e.g. Twitter, Portfolio"
              maxLength={50}
            />
          </div>

          <div className={styles.formField}>
            <Label htmlFor="otherLink">Other Link URL</Label>
            <Input
              id="otherLink"
              type="url"
              value={formData.otherLink}
              onChange={(e) => setFormData({ ...formData, otherLink: e.target.value })}
              placeholder="https://..."
            />
          </div>
        </div>
      </Card>

      {/* Profile Visibility */}
      <Card className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>Profile Visibility</h2>
        <div className={styles.visibilitySection}>
          <div className={styles.visibilityInfo}>
            <Label htmlFor="isPublic" className={styles.visibilityLabel}>
              Make profile public
            </Label>
            <p className={styles.visibilityDescription}>
              Allow others to view your public profile at /u/[username]
            </p>
          </div>
          <label className={styles.toggleSwitch}>
            <input
              type="checkbox"
              checked={formData.isPublic}
              onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
              className={styles.toggleInput}
            />
            <span className={styles.toggleSlider}></span>
          </label>
        </div>
      </Card>

      {/* Error/Success Messages */}
      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      {success && (
        <div className={styles.successMessage}>
          Profile updated successfully!
        </div>
      )}

      {/* Submit Button */}
      <div className={styles.formActions}>
        <Button type="submit" disabled={isPending} className={styles.saveButton}>
          {isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}

