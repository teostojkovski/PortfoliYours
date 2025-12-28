/**
 * Applications List Component
 * Displays all applications in a table
 */

'use client'

import { useState, useTransition } from 'react'
import { Card } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import styles from './applications-list.module.css'
import { ApplicationFormModal } from './application-form-modal'

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

interface ApplicationsListProps {
  applications: Application[]
}

export function ApplicationsList({ applications: initialApplications }: ApplicationsListProps) {
  const router = useRouter()
  const [applications, setApplications] = useState(initialApplications)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingApplication, setEditingApplication] = useState<Application | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

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

  const filteredApplications = applications.filter((app) => {
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter
    const matchesSearch = searchQuery === '' || 
      app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.role.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch && !app.isArchived
  })

  const handleCreate = () => {
    setEditingApplication(null)
    setIsModalOpen(true)
  }

  const handleEdit = (application: Application) => {
    setEditingApplication(application)
    setIsModalOpen(true)
  }

  const handleView = (applicationId: string) => {
    router.push(`/dashboard/applications/${applicationId}`)
  }

  const handleArchive = async (applicationId: string, archived: boolean) => {
    setError(null)
    startTransition(async () => {
      try {
        const response = await fetch(`/api/applications/${applicationId}/archive`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ archived }),
        })

        if (!response.ok) {
          const data = await response.json()
          setError(data.error || 'Failed to archive application')
          return
        }

        setApplications(applications.map((app) =>
          app.id === applicationId ? { ...app, isArchived: archived } : app
        ))
      } catch (err) {
        setError('An error occurred. Please try again.')
      }
    })
  }

  const handleSuccess = () => {
    window.location.reload()
  }

  return (
    <div className={styles.applicationsPage}>
      <div className={styles.applicationsHeader}>
        <div>
          <h1 className={styles.pageTitle}>Applications</h1>
          <p className={styles.pageDescription}>
            Track jobs, documents, and progress
          </p>
        </div>
        <button className={styles.newButton} onClick={handleCreate}>
          + New Application
        </button>
      </div>

      <div className={styles.filters}>
        <select
          className={styles.statusFilter}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="applied">Applied</option>
          <option value="interview">Interview</option>
          <option value="offer">Offer</option>
          <option value="rejected">Rejected</option>
          <option value="withdrawn">Withdrawn</option>
        </select>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search company or role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      {filteredApplications.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No applications yet. Create your first application to get started.</p>
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
              {filteredApplications.map((application) => {
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
                      <div className={styles.actions}>
                        <button
                          className={styles.actionButton}
                          onClick={() => handleView(application.id)}
                          title="View"
                        >
                          👁
                        </button>
                        <button
                          className={styles.actionButton}
                          onClick={() => handleEdit(application)}
                          title="Edit"
                        >
                          ✏
                        </button>
                        <button
                          className={styles.actionButton}
                          onClick={() => handleArchive(application.id, !application.isArchived)}
                          disabled={isPending}
                          title={application.isArchived ? 'Unarchive' : 'Archive'}
                        >
                          📦
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Card>
      )}

      {isModalOpen && (
        <ApplicationFormModal
          application={editingApplication}
          onClose={() => {
            setIsModalOpen(false)
            setEditingApplication(null)
          }}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  )
}

