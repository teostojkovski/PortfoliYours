/**
 * Public Profile Settings Component
 * Configure public profile visibility and settings
 */

'use client'

import { useState, useTransition, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import styles from './public-profile-settings.module.css'

interface PublicProfile {
  id: string
  slug: string
  enabled: boolean
  seoIndexable: boolean
  showProfile: boolean
  showSkills: boolean
  showExperience: boolean
  showProjects: boolean
  showContact: boolean
  allowCvRequest: boolean
  selectedProjectIds: string[]
}

interface PublicProfileSettingsProps {
  publicProfile: PublicProfile | null
}

export function PublicProfileSettings({ publicProfile: initialPublicProfile }: PublicProfileSettingsProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null)

  const [formData, setFormData] = useState({
    slug: initialPublicProfile?.slug || '',
    enabled: initialPublicProfile?.enabled ?? false,
    seoIndexable: initialPublicProfile?.seoIndexable ?? false,
    showProfile: initialPublicProfile?.showProfile ?? true,
    showSkills: initialPublicProfile?.showSkills ?? true,
    showExperience: initialPublicProfile?.showExperience ?? true,
    showProjects: initialPublicProfile?.showProjects ?? true,
    showContact: initialPublicProfile?.showContact ?? false,
    allowCvRequest: initialPublicProfile?.allowCvRequest ?? false,
    selectedProjectIds: initialPublicProfile?.selectedProjectIds || [],
  })

  const checkSlug = async (slug: string) => {
    if (slug.length < 3) {
      setSlugAvailable(null)
      return
    }

    try {
      const response = await fetch(`/api/public-profile/check-slug?slug=${encodeURIComponent(slug)}`)
      const data = await response.json()
      setSlugAvailable(data.available)
    } catch {
      setSlugAvailable(null)
    }
  }

  useEffect(() => {
    if (formData.slug && formData.slug !== initialPublicProfile?.slug) {
      const timeoutId = setTimeout(() => {
        checkSlug(formData.slug)
      }, 500)
      return () => clearTimeout(timeoutId)
    } else {
      setSlugAvailable(null)
    }
  }, [formData.slug, initialPublicProfile?.slug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (formData.enabled && !formData.slug) {
      setError('Username is required when profile is enabled')
      return
    }

    if (formData.enabled && slugAvailable === false) {
      setError('This username is already taken')
      return
    }

    startTransition(async () => {
      try {
        const response = await fetch('/api/public-profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.error || 'Failed to update public profile')
          return
        }

        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } catch (err) {
        setError('An error occurred. Please try again.')
      }
    })
  }

  const publicUrl = formData.enabled && formData.slug
    ? `${window.location.origin}/u/${formData.slug}`
    : null

  return (
    <div className={styles.settingsPage}>
      <form onSubmit={handleSubmit} className={styles.settingsForm}>
        <Card className={styles.settingsCard}>
          <h2 className={styles.sectionTitle}>Profile Status</h2>
          
          <div className={styles.toggleSection}>
            <div className={styles.toggleInfo}>
              <Label htmlFor="enabled" className={styles.toggleLabel}>
                Public profile
              </Label>
              <p className={styles.toggleDescription}>
                Enable your public profile to make it accessible via a shareable link
              </p>
            </div>
            <label className={styles.toggleSwitch}>
              <input
                type="checkbox"
                checked={formData.enabled}
                onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                className={styles.toggleInput}
              />
              <span className={styles.toggleSlider}></span>
            </label>
          </div>

          {formData.enabled && (
            <>
              <div className={styles.formField}>
                <Label htmlFor="slug">Username (URL)</Label>
                <div className={styles.slugInputGroup}>
                  <span className={styles.urlPrefix}>portfoliyours.com/u/</span>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => {
                      const slug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
                      setFormData({ ...formData, slug })
                    }}
                    placeholder="johndoe"
                    required={formData.enabled}
                    minLength={3}
                    maxLength={50}
                  />
                </div>
                {slugAvailable === false && (
                  <p className={styles.errorText}>This username is already taken</p>
                )}
                {slugAvailable === true && (
                  <p className={styles.successText}>✓ Username available</p>
                )}
                {publicUrl && (
                  <p className={styles.urlPreview}>
                    Your profile: <a href={publicUrl} target="_blank" rel="noopener noreferrer">{publicUrl}</a>
                  </p>
                )}
              </div>

              <div className={styles.toggleSection}>
                <div className={styles.toggleInfo}>
                  <Label htmlFor="seoIndexable" className={styles.toggleLabel}>
                    Allow search engines to index
                  </Label>
                  <p className={styles.toggleDescription}>
                    Enable this to allow search engines to index your public profile
                  </p>
                </div>
                <label className={styles.toggleSwitch}>
                  <input
                    type="checkbox"
                    checked={formData.seoIndexable}
                    onChange={(e) => setFormData({ ...formData, seoIndexable: e.target.checked })}
                    className={styles.toggleInput}
                  />
                  <span className={styles.toggleSlider}></span>
                </label>
              </div>
            </>
          )}
        </Card>

        {formData.enabled && (
          <Card className={styles.settingsCard}>
            <h2 className={styles.sectionTitle}>Visible Sections</h2>
            
            <div className={styles.visibilityGrid}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.showProfile}
                  onChange={(e) => setFormData({ ...formData, showProfile: e.target.checked })}
                />
                <span>Profile (Name, Headline, Bio, Location)</span>
              </label>

              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.showSkills}
                  onChange={(e) => setFormData({ ...formData, showSkills: e.target.checked })}
                />
                <span>Skills</span>
              </label>

              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.showExperience}
                  onChange={(e) => setFormData({ ...formData, showExperience: e.target.checked })}
                />
                <span>Experience</span>
              </label>

              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.showProjects}
                  onChange={(e) => setFormData({ ...formData, showProjects: e.target.checked })}
                />
                <span>Projects</span>
              </label>

              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.showContact}
                  onChange={(e) => setFormData({ ...formData, showContact: e.target.checked })}
                />
                <span>Contact</span>
              </label>
            </div>
          </Card>
        )}

        {formData.enabled && (
          <Card className={styles.settingsCard}>
            <h2 className={styles.sectionTitle}>Contact Options</h2>
            
            <div className={styles.toggleSection}>
              <div className={styles.toggleInfo}>
                <Label htmlFor="allowCvRequest" className={styles.toggleLabel}>
                  Allow CV requests
                </Label>
                <p className={styles.toggleDescription}>
                  Show a contact button that allows visitors to request your CV
                </p>
              </div>
              <label className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={formData.allowCvRequest}
                  onChange={(e) => setFormData({ ...formData, allowCvRequest: e.target.checked })}
                  className={styles.toggleInput}
                />
                <span className={styles.toggleSlider}></span>
              </label>
            </div>
          </Card>
        )}

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        {success && (
          <div className={styles.successMessage}>
            Public profile settings saved successfully!
          </div>
        )}

        <div className={styles.formActions}>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}

