'use client'

import { useState, useTransition } from 'react'
import { Card } from '@/components/ui/card'
import { Archive, X } from 'lucide-react'
import styles from './archives-modal.module.css'

interface ApplicationDocument {
  id: string
  type: string
  fileName: string
  fileUrl: string
}

interface Application {
  id: string
  company: string
  role: string
  location: string | null
  status: string
  appliedAt: Date | null
  link: string | null
  isArchived: boolean
  documents: ApplicationDocument[]
  createdAt: Date
}

interface ArchivesModalProps {
  applications: Application[]
  onClose: () => void
  onUnarchive: (applicationId: string) => void
}

export function ArchivesModal({ applications, onClose, onUnarchive }: ArchivesModalProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const archivedApplications = applications.filter((app) => app.isArchived)

  const formatDate = (date: Date | null) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getStatusBadge = (status: string) => {
    const statusLabels: Record<string, string> = {
      draft: 'Draft',
      applied: 'Applied',
      interview: 'Interview',
      offer: 'Offer',
      rejected: 'Rejected',
      withdrawn: 'Withdrawn',
    }
    return statusLabels[status] || status
  }

  const getStatusClass = (status: string) => {
    const statusClasses: Record<string, string> = {
      draft: styles.statusDraft,
      applied: styles.statusApplied,
      interview: styles.statusInterview,
      offer: styles.statusOffer,
      rejected: styles.statusRejected,
      withdrawn: styles.statusWithdrawn,
    }
    return statusClasses[status] || ''
  }

  const handleUnarchive = async (applicationId: string) => {
    setError(null)
    startTransition(async () => {
      try {
        const response = await fetch(`/api/applications/${applicationId}/archive`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ archived: false }),
        })

        if (!response.ok) {
          const data = await response.json()
          setError(data.error || 'Failed to unarchive application')
          return
        }

        onUnarchive(applicationId)
      } catch (err) {
        setError('An error occurred. Please try again.')
      }
    })
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <Card className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <h2 className={styles.modalTitle}>Archived Applications</h2>
            <p className={styles.modalSubtitle}>
              {archivedApplications.length} archived application{archivedApplications.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <div className={styles.content}>
          {archivedApplications.length === 0 ? (
            <div className={styles.emptyState}>
              <Archive size={48} className={styles.emptyIcon} />
              <p>No archived applications</p>
            </div>
          ) : (
            <Card className={styles.applicationsTable}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>CV</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {archivedApplications.map((application) => {
                    const hasCv = application.documents.some((doc) => doc.type === 'CV')
                    return (
                      <tr key={application.id}>
                        <td>
                          <div className={styles.companyCell}>
                            <span className={styles.company}>{application.company}</span>
                            {application.location && (
                              <span className={styles.location}>{application.location}</span>
                            )}
                          </div>
                        </td>
                        <td>{application.role}</td>
                        <td>
                          <span className={`${styles.statusBadge} ${getStatusClass(application.status)}`}>
                            {getStatusBadge(application.status)}
                          </span>
                        </td>
                        <td>
                          {hasCv ? (
                            <span className={styles.checkmark}>✔</span>
                          ) : (
                            <span className={styles.noCv}>-</span>
                          )}
                        </td>
                        <td>{formatDate(application.appliedAt)}</td>
                        <td>
                          <button
                            className={styles.unarchiveButton}
                            onClick={() => handleUnarchive(application.id)}
                            disabled={isPending}
                          >
                            Unarchive
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </Card>
          )}
        </div>
      </Card>
    </div>
  )
}

