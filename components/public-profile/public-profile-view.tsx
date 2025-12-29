

'use client'

import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Download, ExternalLink } from 'lucide-react'
import styles from './public-profile-view.module.css'

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
  selectedExperienceIds: string[]
  selectedCvId: string | null
  user: {
    id: string
    fullName: string
    dateOfBirth?: Date
    profile: {
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
    skills: Array<{
      id: string
      name: string
      level: number
      category: {
        name: string
      }
      projectSkills: Array<{ id: string }>
    }>
    experiences: Array<{
      id: string
      company: string
      role: string
      startDate: Date
      endDate: Date | null
      location: string | null
      bullets: string[]
    }>
    portfolioItems: Array<{
      id: string
      title: string
      description: string | null
      url: string | null
      tags: string[]
      imageUrl: string | null
    }>
    documents: Array<{
      id: string
      name: string
      fileUrl: string
    }>
  }
}

interface PublicProfileViewProps {
  publicProfile: PublicProfile
}

export function PublicProfileView({ publicProfile }: PublicProfileViewProps) {
  const { user, showProfile, showSkills, showExperience, showProjects, showContact, allowCvRequest, selectedCvId } = publicProfile
  const profile = user.profile

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date
    return new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  const formatDateRange = (startDate: Date | string, endDate: Date | string | null) => {
    const start = formatDate(startDate)
    if (!endDate) {
      return `${start} – Present`
    }
    const end = formatDate(endDate)
    return `${start} – ${end}`
  }

  const renderStars = (level: number) => {
    return '★'.repeat(level) + '☆'.repeat(5 - level)
  }

  const skillsByCategory: Record<string, typeof user.skills> = {}
  user.skills.forEach((skill) => {
    const categoryName = skill.category.name
    if (!skillsByCategory[categoryName]) {
      skillsByCategory[categoryName] = []
    }
    skillsByCategory[categoryName].push(skill)
  })

  const selectedCv = selectedCvId
    ? user.documents.find((doc) => doc.id === selectedCvId)
    : null

  return (
    <div className={styles.publicProfile}>
      {}
      {showProfile && (
        <div className={styles.header}>
          {profile?.avatarUrl && (
            <Image
              src={profile.avatarUrl}
              alt={user.fullName}
              width={120}
              height={120}
              className={styles.avatar}
            />
          )}
          <div className={styles.headerContent}>
            <h1 className={styles.name}>{user.fullName}</h1>
            {profile?.title && (
              <p className={styles.title}>{profile.title}</p>
            )}
            {profile?.location && (
              <p className={styles.location}>{profile.location}</p>
            )}
            {user.dateOfBirth && (
              <p className={styles.birthDate}>
                Born: {formatDate(user.dateOfBirth)}
              </p>
            )}
            {(profile?.website || profile?.github || profile?.linkedin || profile?.otherLink) && (
              <div className={styles.socialLinks}>
                {profile.website && (
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                    <ExternalLink size={16} />
                    Website
                  </a>
                )}
                {profile.github && (
                  <a href={profile.github} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                    <ExternalLink size={16} />
                    GitHub
                  </a>
                )}
                {profile.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                    <ExternalLink size={16} />
                    LinkedIn
                  </a>
                )}
                {profile.otherLink && (
                  <a href={profile.otherLink} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                    <ExternalLink size={16} />
                    {profile.otherLabel || 'Other'}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {}
      {showProfile && profile?.bio && (
        <Card className={styles.section}>
          <h2 className={styles.sectionTitle}>About</h2>
          <p className={styles.bio}>{profile.bio}</p>
        </Card>
      )}

      {}
      {showSkills && Object.keys(skillsByCategory).length > 0 && (
        <Card className={styles.section}>
          <h2 className={styles.sectionTitle}>Skills</h2>
          <div className={styles.skillsGrid}>
            {Object.entries(skillsByCategory).map(([category, skills]) => (
              <div key={category} className={styles.skillCategory}>
                <h3 className={styles.categoryName}>{category}</h3>
                <div className={styles.skillsList}>
                  {skills.map((skill) => (
                    <div key={skill.id} className={styles.skillItem}>
                      <span className={styles.skillName}>{skill.name}</span>
                      <span className={styles.skillLevel}>{renderStars(skill.level)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {}
      {showExperience && user.experiences.length > 0 && (
        <Card className={styles.section}>
          <h2 className={styles.sectionTitle}>Experience</h2>
          <div className={styles.experienceList}>
            {user.experiences.map((experience) => (
              <div key={experience.id} className={styles.experienceItem}>
                <div className={styles.experienceHeader}>
                  <div>
                    <h3 className={styles.experienceRole}>{experience.role}</h3>
                    <p className={styles.experienceCompany}>{experience.company}</p>
                  </div>
                  <p className={styles.experienceDates}>
                    {formatDateRange(experience.startDate, experience.endDate)}
                  </p>
                </div>
                {experience.location && (
                  <p className={styles.experienceLocation}>{experience.location}</p>
                )}
                {experience.bullets && experience.bullets.length > 0 && (
                  <ul className={styles.experienceBullets}>
                    {experience.bullets.map((bullet, index) => (
                      <li key={index}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {}
      {showProjects && user.portfolioItems.length > 0 && (
        <Card className={styles.section}>
          <h2 className={styles.sectionTitle}>Projects</h2>
          <div className={styles.projectsGrid}>
            {user.portfolioItems.map((project) => (
              <div key={project.id} className={styles.projectCard}>
                {project.imageUrl && (
                  <div className={styles.projectImageContainer}>
                    <Image
                      src={project.imageUrl}
                      alt={project.title}
                      width={300}
                      height={180}
                      className={styles.projectImage}
                    />
                  </div>
                )}
                <h3 className={styles.projectTitle}>{project.title}</h3>
                {project.description && (
                  <p className={styles.projectDescription}>{project.description}</p>
                )}
                {project.tags && project.tags.length > 0 && (
                  <div className={styles.projectTags}>
                    {project.tags.map((tag, index) => (
                      <span key={index} className={styles.tag}>{tag}</span>
                    ))}
                  </div>
                )}
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.projectLink}
                  >
                    View Project <ExternalLink size={14} />
                  </a>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {}
      {allowCvRequest && selectedCv && (
        <Card className={styles.section}>
          <h2 className={styles.sectionTitle}>Resume</h2>
          <div className={styles.cvSection}>
            <p className={styles.cvText}>
              Download my resume to learn more about my experience and qualifications.
            </p>
            <a
              href={selectedCv.fileUrl}
              download={selectedCv.name}
              className={styles.cvDownloadButton}
            >
              <Download size={18} />
              Download CV
            </a>
          </div>
        </Card>
      )}

      {}
      {showContact && (
        <Card className={styles.section}>
          <h2 className={styles.sectionTitle}>Contact</h2>
          {allowCvRequest ? (
            <div className={styles.contactSection}>
              <p className={styles.contactText}>
                Interested in working together? Request my CV or get in touch.
              </p>
              <button className={styles.contactButton}>
                Request CV / Contact
              </button>
            </div>
          ) : (
            <p className={styles.contactText}>
              For inquiries, please reach out through the social links above.
            </p>
          )}
        </Card>
      )}
    </div>
  )
}
