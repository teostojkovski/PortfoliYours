/**
 * Document Preview Modal Component
 */

'use client'

import { Card } from '@/components/ui/card'
import styles from './document-preview-modal.module.css'

interface Document {
  id: string
  name: string
  type: string
  fileUrl: string
  fileType: string
}

interface DocumentPreviewModalProps {
  document: Document
  onClose: () => void
}

export function DocumentPreviewModal({ document, onClose }: DocumentPreviewModalProps) {
  const canPreviewInline = ['pdf', 'png', 'jpg', 'jpeg'].includes(document.fileType.toLowerCase())

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <Card className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{document.name}</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div className={styles.previewContainer}>
          {canPreviewInline ? (
            <iframe
              src={document.fileUrl}
              className={styles.previewFrame}
              title={document.name}
            />
          ) : (
            <div className={styles.downloadOnly}>
              <p>Preview not available for {document.fileType.toUpperCase()} files.</p>
              <a
                href={document.fileUrl}
                download
                className={styles.downloadLink}
              >
                Download File
              </a>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

