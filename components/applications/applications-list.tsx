'use client'

import { useState, useTransition, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Eye, Edit, Archive } from 'lucide-react'
import styles from './applications-list.module.css'
import { ApplicationFormModal } from './application-form-modal'
import { ApplicationPreviewModal } from './application-preview-modal'
import { ArchivesModal } from './archives-modal'

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
  notes: string | null
  recruiterName: string | null
  recruiterEmail: string | null
  followUpAt: Date | null
  isArchived: boolean
  documents: ApplicationDocument[]
  createdAt: Date
}

interface ApplicationsListProps {
  applications: Application[]
}

export function ApplicationsList({ applications: initialApplications }: ApplicationsListProps) {
  const [applications, setApplications] = useState(initialApplications)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)
  const [isArchivesModalOpen, setIsArchivesModalOpen] = useState(false)
  const [previewingApplication, setPreviewingApplication] = useState<Application | null>(null)
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

  const handleView = (application: Application) => {
    setPreviewingApplication(application)
    setIsPreviewModalOpen(true)
  }

  const handleUnarchive = (applicationId: string) => {
    setApplications(applications.map((app) =>
      app.id === applicationId ? { ...app, isArchived: false } : app
    ))
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

  const [statusDropdownOpen, setStatusDropdownOpen] = useState<string | null>(null)
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null)
  const statusButtonRefs = useRef<Record<string, HTMLButtonElement>>({})

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const isClickInside = Object.values(statusButtonRefs.current).some(
        (ref) => ref && ref.contains(target)
      )
      if (!isClickInside) {
        setStatusDropdownOpen(null)
        setDropdownPosition(null)
      }
    }

    if (statusDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [statusDropdownOpen])

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    setError(null)
    setStatusDropdownOpen(null)
    startTransition(async () => {
      try {
        const response = await fetch(`/api/applications/${applicationId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        })

        if (!response.ok) {
          const data = await response.json()
          setError(data.error || 'Failed to update status')
          return
        }

        setApplications(applications.map((app) =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        ))
      } catch (err) {
        setError('An error occurred. Please try again.')
      }
    })
  }

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'applied', label: 'Applied' },
    { value: 'interview', label: 'Interview' },
    { value: 'offer', label: 'Offer' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'withdrawn', label: 'Withdrawn' },
  ]

  return (
    <div className={styles.applicationsPage}>
      <div className={styles.applicationsHeader}>
        <div>
          <p className={styles.pageDescription}>
            Track jobs, documents, and progress
          </p>
        </div>
        <div className={styles.headerActions}>
          <button 
            className={styles.archiveButton} 
            onClick={() => setIsArchivesModalOpen(true)}
            title="View archived applications"
          >
            <Archive size={18} />
            Archives ({applications.filter(app => app.isArchived).length})
          </button>
          <button className={styles.newButton} onClick={handleCreate}>
            + New Application
          </button>
        </div>
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
                      <div className={styles.statusContainer}>
                        <button
                          ref={(el) => {
                            if (el) statusButtonRefs.current[application.id] = el
                          }}
                          className={`${styles.statusBadge} ${styles.statusBadgeClickable} ${getStatusClass(application.status)}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            const button = statusButtonRefs.current[application.id]
                            if (button) {
                              const rect = button.getBoundingClientRect()
                              setDropdownPosition({
                                top: rect.bottom + 4,
                                left: rect.left,
                              })
                            }
                            setStatusDropdownOpen(statusDropdownOpen === application.id ? null : application.id)
                          }}
                          disabled={isPending}
                          title="Click to change status"
                        >
                          {getStatusBadge(application.status)}
                        </button>
                        {statusDropdownOpen === application.id && dropdownPosition && (
                          <div 
                            className={styles.statusDropdown}
                            style={{
                              top: `${dropdownPosition.top}px`,
                              left: `${dropdownPosition.left}px`,
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {statusOptions.map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                className={`${styles.statusOption} ${application.status === option.value ? styles.statusOptionActive : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleStatusChange(application.id, option.value)
                                }}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
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
                          onClick={() => handleView(application)}
                          title="Preview"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className={styles.actionButton}
                          onClick={() => handleEdit(application)}
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className={styles.actionButton}
                          onClick={() => handleArchive(application.id, !application.isArchived)}
                          disabled={isPending}
                          title={application.isArchived ? 'Unarchive' : 'Archive'}
                        >
                          <Archive size={16} />
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

      {isPreviewModalOpen && previewingApplication && (
        <ApplicationPreviewModal
          application={previewingApplication}
          onClose={() => {
            setIsPreviewModalOpen(false)
            setPreviewingApplication(null)
          }}
        />
      )}

      {isArchivesModalOpen && (
        <ArchivesModal
          applications={applications}
          onClose={() => setIsArchivesModalOpen(false)}
          onUnarchive={handleUnarchive}
        />
      )}
    </div>
  )
}

