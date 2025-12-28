/**
 * Project Detail View Component
 * Displays full project details
 */

'use client'

import { Eye, ExternalLink, Edit, Trash2, Calendar } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import styles from './project-detail-view.module.css'

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
}

interface ProjectDetailViewProps {
  project: Project
}

export function ProjectDetailView({ project }: ProjectDetailViewProps) {
  const router = useRouter()

  const formatType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1)
  }

  const formatDate = (date: Date | null) => {
    if (!date) return null
    return new Date(date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return
    }

    try {
      const response = await fetch(`/api/portfolio/${project.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete project')
      }

      router.push('/dashboard/projects')
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Failed to delete project. Please try again.')
    }
  }

  return (
    <div className={styles.detailView}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{project.title}</h1>
            <span
              className={`${styles.visibilityBadge} ${
                project.isPublished ? styles.public : styles.private
              }`}
            >
              {project.isPublished ? 'Public' : 'Private'}
            </span>
          </div>
          <div className={styles.metaRow}>
            <span className={styles.type}>{formatType(project.type)}</span>
            {(project.startDate || project.endDate) && (
              <span className={styles.dateRange}>
                <Calendar size={14} />
                {formatDate(project.startDate) || 'Unknown'} –{' '}
                {formatDate(project.endDate) || 'Present'}
              </span>
            )}
          </div>
        </div>
        <div className={styles.actions}>
          <Link href={`/dashboard/projects`} className={styles.actionButton}>
            ← Back to Projects
          </Link>
          <button
            onClick={() => router.push(`/dashboard/projects?edit=${project.id}`)}
            className={styles.editButton}
          >
            <Edit size={16} />
            Edit
          </button>
          <button onClick={handleDelete} className={styles.deleteButton}>
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>

      {project.description && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Description</h2>
          <p className={styles.description}>{project.description}</p>
        </div>
      )}

      {project.detailedDescription && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Detailed Description</h2>
          <p className={styles.detailedDescription}>{project.detailedDescription}</p>
        </div>
      )}

      {project.tags && project.tags.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Tech Stack</h2>
          <div className={styles.tags}>
            {project.tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {project.url && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Links</h2>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            <ExternalLink size={16} />
            {project.url.includes('github.com') ? 'GitHub' : 'View Project'}
          </a>
        </div>
      )}

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Used in</h2>
        <p className={styles.mutedText}>
          Project references will appear here when linked to applications or public profile.
        </p>
      </div>
    </div>
  )
}

