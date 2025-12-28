/**
 * Documents List Component
 * Displays all uploaded documents with actions
 */

'use client'

import { useState, useTransition } from 'react'
import { Card } from '@/components/ui/card'
import styles from './documents-list.module.css'
import { DocumentUploadModal } from './document-upload-modal'

interface Document {
  id: string
  name: string
  type: string
  fileUrl: string
  fileType: string
  fileSize: number
  notes: string | null
  createdAt: Date
}

interface DocumentsListProps {
  documents: Document[]
}

export function DocumentsList({ documents: initialDocuments }: DocumentsListProps) {
  const [documents, setDocuments] = useState(initialDocuments)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [filterType, setFilterType] = useState<string>('all')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'CV':
        return 'CV / Resume'
      case 'COVER_LETTER':
        return 'Cover Letter'
      case 'OTHER':
        return 'Other Document'
      default:
        return type
    }
  }

  const filteredDocuments = filterType === 'all'
    ? documents
    : documents.filter((doc) => doc.type === filterType)

  const handleUploadSuccess = () => {
    window.location.reload()
  }

  const handleDownload = (doc: Document) => {
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a')
    link.href = doc.fileUrl
    link.download = doc.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDelete = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return
    }

    setError(null)
    startTransition(async () => {
      try {
        const response = await fetch(`/api/documents/${documentId}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          const data = await response.json()
          setError(data.error || 'Failed to delete document')
          return
        }

        setDocuments(documents.filter((doc) => doc.id !== documentId))
      } catch (err) {
        setError('An error occurred. Please try again.')
      }
    })
  }

  return (
    <div className={styles.documentsPage}>
      <div className={styles.documentsHeader}>
        <div>
          <h1 className={styles.pageTitle}>Documents</h1>
          <p className={styles.pageDescription}>
            Upload and manage your documents (CVs, cover letters, and other files)
          </p>
        </div>
        <div className={styles.headerActions}>
          <select
            className={styles.filterSelect}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All</option>
            <option value="CV">CV</option>
            <option value="COVER_LETTER">Cover Letter</option>
            <option value="OTHER">Other</option>
          </select>
          <button className={styles.uploadButton} onClick={() => setIsUploadModalOpen(true)}>
            + Upload Document
          </button>
        </div>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      {filteredDocuments.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No documents yet. Upload your first document to get started.</p>
        </div>
      ) : (
        <Card className={styles.documentsTable}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Date</th>
                <th>Size</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.map((document) => (
                <tr key={document.id}>
                  <td>
                    <div className={styles.nameCell}>
                      <span className={styles.name}>{document.name}</span>
                      {document.notes && (
                        <span className={styles.notes}>{document.notes}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={styles.typeBadge}>{getTypeLabel(document.type)}</span>
                  </td>
                  <td>{formatDate(document.createdAt)}</td>
                  <td>{formatFileSize(document.fileSize)}</td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={styles.actionButton}
                        onClick={() => handleDownload(document)}
                        title="Download"
                      >
                        ⬇
                      </button>
                      <button
                        className={styles.actionButtonDanger}
                        onClick={() => handleDelete(document.id)}
                        disabled={isPending}
                        title="Delete"
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {isUploadModalOpen && (
        <DocumentUploadModal
          onClose={() => setIsUploadModalOpen(false)}
          onSuccess={handleUploadSuccess}
        />
      )}

    </div>
  )
}
