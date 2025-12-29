'use client'

import { Card } from '@/components/ui/card'
import styles from './application-preview-modal.module.css'

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
  documents: ApplicationDocument[]
}

interface ApplicationPreviewModalProps {
  application: Application
  onClose: () => void
}

export function ApplicationPreviewModal({ application, onClose }: ApplicationPreviewModalProps) {
  const formatDate = (date: Date | null) => {
    if (!date) return 'Not set'
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  const getStatusLabel = (status: string) => {
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

  const hasCv = application.documents.some((doc) => doc.type === 'CV')
  const hasCoverLetter = application.documents.some((doc) => doc.type === 'COVER_LETTER')

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <Card className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Application Preview</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div className={styles.previewContent}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Company Information</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Company:</span>
                <span className={styles.infoValue}>{application.company}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Role:</span>
                <span className={styles.infoValue}>{application.role}</span>
              </div>
              {application.location && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Location:</span>
                  <span className={styles.infoValue}>{application.location}</span>
                </div>
              )}
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Status:</span>
                <span className={styles.infoValue}>{getStatusLabel(application.status)}</span>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Application Details</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Applied Date:</span>
                <span className={styles.infoValue}>{formatDate(application.appliedAt)}</span>
              </div>
              {application.link && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Job Link:</span>
                  <a 
                    href={application.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    {application.link}
                  </a>
                </div>
              )}
              {application.followUpAt && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Follow-up Date:</span>
                  <span className={styles.infoValue}>{formatDate(application.followUpAt)}</span>
                </div>
              )}
            </div>
          </div>

          {(application.recruiterName || application.recruiterEmail) && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Recruiter Information</h3>
              <div className={styles.infoGrid}>
                {application.recruiterName && (
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Name:</span>
                    <span className={styles.infoValue}>{application.recruiterName}</span>
                  </div>
                )}
                {application.recruiterEmail && (
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Email:</span>
                    <a 
                      href={`mailto:${application.recruiterEmail}`}
                      className={styles.link}
                    >
                      {application.recruiterEmail}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Documents</h3>
            <div className={styles.documentsList}>
              <div className={styles.documentItem}>
                <span className={styles.infoLabel}>CV:</span>
                <span className={styles.infoValue}>{hasCv ? '✓ Attached' : '✗ Not attached'}</span>
              </div>
              <div className={styles.documentItem}>
                <span className={styles.infoLabel}>Cover Letter:</span>
                <span className={styles.infoValue}>{hasCoverLetter ? '✓ Attached' : '✗ Not attached'}</span>
              </div>
            </div>
          </div>

          {application.notes && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Notes</h3>
              <p className={styles.notes}>{application.notes}</p>
            </div>
          )}
        </div>

        <div className={styles.modalActions}>
          <button className={styles.closeBtn} onClick={onClose}>
            Close
          </button>
        </div>
      </Card>
    </div>
  )
}

