

'use client'

import { useState, useTransition, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { ExternalLink, Download, Save } from 'lucide-react'
import styles from './public-profile-builder.module.css'

interface User {
  id: string
  email: string
  fullName: string
  dateOfBirth: Date
  profile: {
    id: string
    title: string | null
    bio: string | null
    location: string | null
    avatarUrl: string | null
    website: string | null
    github: string | null
    linkedin: string | null
    otherLink: string | null
    otherLabel: string | null
  } | null
  publicProfile: {
    id: string
    slug: string
    enabled: boolean
    seoIndexable: boolean
    selectedProjectIds: string[]
    selectedExperienceIds: string[]
    selectedCvId: string | null
  } | null
  portfolioItems: Array<{
    id: string
    title: string
    description: string | null
    imageUrl: string | null
    url: string | null
    tags: string[]
  }>
  experiences: Array<{
    id: string
    company: string
    role: string
    startDate: Date
    endDate: Date | null
    location: string | null
  }>
  documents: Array<{
    id: string
    name: string
    fileUrl: string
  }>
}

interface PublicProfileBuilderProps {
  user: User
}

export function PublicProfileBuilder({ user: initialUser }: PublicProfileBuilderProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [selectedProjects, setSelectedProjects] = useState<string[]>(
    initialUser.publicProfile?.selectedProjectIds || []
  )
  const [selectedExperiences, setSelectedExperiences] = useState<string[]>(
    initialUser.publicProfile?.selectedExperienceIds || []
  )
  const [selectedCvId, setSelectedCvId] = useState<string | null>(
    initialUser.publicProfile?.selectedCvId || null
  )

  const [publicUrl, setPublicUrl] = useState<string | null>(null)

  useEffect(() => {
    if (initialUser.publicProfile?.enabled && initialUser.publicProfile?.slug) {
      setPublicUrl(`${window.location.origin}/u/${initialUser.publicProfile.slug}`)
    } else {
      setPublicUrl(null)
    }
  }, [initialUser.publicProfile?.enabled, initialUser.publicProfile?.slug])

  const handleSave = async () => {
    setError(null)
    setSuccess(false)

    if (!initialUser.publicProfile?.enabled) {
      setError('Please enable public profile in Settings first')
      return
    }

    startTransition(async () => {
      try {
        const response = await fetch('/api/public-profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slug: initialUser.publicProfile?.slug,
            enabled: initialUser.publicProfile?.enabled,
            selectedProjectIds: selectedProjects,
            selectedExperienceIds: selectedExperiences,
            selectedCvId: selectedCvId,

            seoIndexable: initialUser.publicProfile?.seoIndexable || false,
            showProfile: true,
            showSkills: true,
            showExperience: true,
            showProjects: true,
            showContact: false,
            allowCvRequest: selectedCvId !== null,
          }),
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

  const toggleProject = (projectId: string) => {
    setSelectedProjects(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    )
  }

  const toggleExperience = (experienceId: string) => {
    setSelectedExperiences(prev =>
      prev.includes(experienceId)
        ? prev.filter(id => id !== experienceId)
        : [...prev, experienceId]
    )
  }

  if (!initialUser.publicProfile?.enabled) {
    return (
      <div className={styles.builderPage}>
        <div className={styles.enablePrompt}>
          <h2>Enable Public Profile</h2>
          <p>Please enable your public profile in Settings to start building your public page.</p>
          <Button onClick={() => window.location.href = '/dashboard/settings'}>
            Go to Settings
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.builderPage}>
      <div className={styles.builderHeader}>
        <div>
          <p className={styles.pageDescription}>
            Customize what appears on your public profile
          </p>
        </div>
      </div>

      {}
      <Card className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>Basic Information</h2>
        <div className={styles.basicInfo}>
          <div className={styles.avatarSection}>
            {initialUser.profile?.avatarUrl ? (
              <Image
                src={initialUser.profile.avatarUrl}
                alt={initialUser.fullName}
                width={120}
                height={120}
                className={styles.avatar}
              />
            ) : (
              <div className={styles.avatarPlaceholder}>
                {initialUser.fullName.charAt(0).toUpperCase()}
              </div>
            )}
            <p className={styles.avatarHint}>Update avatar in Profile settings</p>
          </div>
          <div className={styles.infoGrid}>
            <div>
              <Label>Full Name</Label>
              <p className={styles.infoValue}>{initialUser.fullName}</p>
            </div>
            <div>
              <Label>Date of Birth</Label>
              <p className={styles.infoValue}>
                {new Date(initialUser.dateOfBirth).toLocaleDateString()}
              </p>
            </div>
            <div>
              <Label>Professional Title</Label>
              <p className={styles.infoValue}>
                {initialUser.profile?.title || 'Not set'}
              </p>
            </div>
            <div>
              <Label>Location</Label>
              <p className={styles.infoValue}>
                {initialUser.profile?.location || 'Not set'}
              </p>
            </div>
          </div>
        </div>
        {initialUser.profile?.bio && (
          <div className={styles.bioSection}>
            <Label>Bio</Label>
            <p className={styles.bioText}>{initialUser.profile.bio}</p>
          </div>
        )}
      </Card>

      {}
      <Card className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>Social Links</h2>
        <div className={styles.socialLinks}>
          {initialUser.profile?.website && (
            <a href={initialUser.profile.website} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <ExternalLink size={16} />
              Website
            </a>
          )}
          {initialUser.profile?.github && (
            <a href={initialUser.profile.github} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <ExternalLink size={16} />
              GitHub
            </a>
          )}
          {initialUser.profile?.linkedin && (
            <a href={initialUser.profile.linkedin} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <ExternalLink size={16} />
              LinkedIn
            </a>
          )}
          {initialUser.profile?.otherLink && (
            <a href={initialUser.profile.otherLink} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <ExternalLink size={16} />
              {initialUser.profile.otherLabel || 'Other'}
            </a>
          )}
          {!initialUser.profile?.website && !initialUser.profile?.github && !initialUser.profile?.linkedin && (
            <p className={styles.emptyState}>No social links added. Update in Profile settings.</p>
          )}
        </div>
      </Card>

      {}
      <Card className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>Select Projects to Display</h2>
        <p className={styles.sectionDescription}>
          Choose which projects appear on your public profile as cards
        </p>
        {initialUser.portfolioItems.length === 0 ? (
          <p className={styles.emptyState}>No projects added yet. Add projects in the Projects section.</p>
        ) : (
          <div className={styles.selectionGrid}>
            {initialUser.portfolioItems.map((project) => (
              <div
                key={project.id}
                className={`${styles.selectableCard} ${selectedProjects.includes(project.id) ? styles.selected : ''}`}
                onClick={() => toggleProject(project.id)}
              >
                <div className={styles.cardCheckbox} onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedProjects.includes(project.id)}
                    onChange={() => toggleProject(project.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                {project.imageUrl && (
                  <div className={styles.cardImage}>
                    <Image
                      src={project.imageUrl}
                      alt={project.title}
                      width={200}
                      height={120}
                      className={styles.projectImage}
                    />
                  </div>
                )}
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{project.title}</h3>
                  {project.description && (
                    <p className={styles.cardDescription}>{project.description}</p>
                  )}
                  {project.tags.length > 0 && (
                    <div className={styles.cardTags}>
                      {project.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className={styles.tag}>{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {}
      <Card className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>Select Experiences to Display</h2>
        <p className={styles.sectionDescription}>
          Choose which work experiences appear on your public profile
        </p>
        {initialUser.experiences.length === 0 ? (
          <p className={styles.emptyState}>No experiences added yet. Add experiences in the Experience section.</p>
        ) : (
          <div className={styles.experienceList}>
            {initialUser.experiences.map((experience) => (
              <div
                key={experience.id}
                className={`${styles.experienceItem} ${selectedExperiences.includes(experience.id) ? styles.selected : ''}`}
                onClick={() => toggleExperience(experience.id)}
              >
                <div className={styles.experienceCheckbox} onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedExperiences.includes(experience.id)}
                    onChange={() => toggleExperience(experience.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div className={styles.experienceContent}>
                  <h3 className={styles.experienceRole}>{experience.role}</h3>
                  <p className={styles.experienceCompany}>{experience.company}</p>
                  <p className={styles.experienceDates}>
                    {new Date(experience.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {' '}
                    {experience.endDate
                      ? new Date(experience.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                      : 'Present'}
                  </p>
                  {experience.location && (
                    <p className={styles.experienceLocation}>{experience.location}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {}
      <Card className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>Select CV for Download</h2>
        <p className={styles.sectionDescription}>
          Choose which CV visitors can download from your public profile
        </p>
        {initialUser.documents.length === 0 ? (
          <p className={styles.emptyState}>No CVs uploaded yet. Upload a CV in the CVs section.</p>
        ) : (
          <div className={styles.cvList}>
            {initialUser.documents.map((doc) => (
              <div
                key={doc.id}
                className={`${styles.cvItem} ${selectedCvId === doc.id ? styles.selected : ''}`}
                onClick={() => setSelectedCvId(selectedCvId === doc.id ? null : doc.id)}
              >
                <div className={styles.cvRadio}>
                  <input
                    type="radio"
                    name="cv"
                    checked={selectedCvId === doc.id}
                    onChange={() => setSelectedCvId(doc.id)}
                  />
                </div>
                <div className={styles.cvContent}>
                  <h3 className={styles.cvName}>{doc.name}</h3>
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.cvDownload}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Download size={16} />
                    Preview
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      {success && (
        <div className={styles.successMessage}>
          Public profile updated successfully!
        </div>
      )}

      <div className={styles.saveActions}>
        <Button onClick={handleSave} disabled={isPending} size="lg">
          <Save size={16} />
          {isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  )
}

