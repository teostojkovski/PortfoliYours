

'use client'

import { useState, useTransition } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import styles from './document-upload-modal.module.css'

interface DocumentUploadModalProps {
  onClose: () => void
  onSuccess: () => void
}

export function DocumentUploadModal({ onClose, onSuccess }: DocumentUploadModalProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    type: 'CV' as 'CV' | 'COVER_LETTER' | 'OTHER',
    notes: '',
  })

  const documentTypeOptions = [
    { value: 'CV', label: 'CV / Resume' },
    { value: 'COVER_LETTER', label: 'Cover Letter' },
    { value: 'OTHER', label: 'Other Document' },
  ]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      if (!formData.name) {
        setFormData({ ...formData, name: file.name.replace(/\.[^/.]+$/, '') })
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!selectedFile) {
      setError('Please select a file')
      return
    }

    startTransition(async () => {
      try {
        const uploadData = new FormData()
        uploadData.append('file', selectedFile)
        uploadData.append('name', formData.name)
        uploadData.append('type', formData.type)
        if (formData.notes) {
          uploadData.append('notes', formData.notes)
        }

        const response = await fetch('/api/documents', {
          method: 'POST',
          body: uploadData,
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.error || 'Failed to upload document')
          return
        }

        onSuccess()
        onClose()
      } catch (err) {
        setError('An error occurred. Please try again.')
      }
    })
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <Card className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Upload Document</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formField}>
            <Label htmlFor="name">Document name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Frontend CV"
              required
              maxLength={200}
            />
          </div>

          <div className={styles.formField}>
            <Label htmlFor="type">Document type</Label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className={styles.select}
              required
            >
              <option value="CV">CV</option>
              <option value="COVER_LETTER">Cover Letter</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className={styles.formField}>
            <Label htmlFor="file">Upload file</Label>
            <input
              id="file"
              type="file"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              onChange={handleFileChange}
              className={styles.fileInput}
              required
            />
            {selectedFile && (
              <p className={styles.fileInfo}>
                Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
            <p className={styles.fileHint}>
              Allowed: PDF, DOC, DOCX, PNG, JPG (max 10MB)
            </p>
          </div>

          <div className={styles.formField}>
            <Label htmlFor="notes">Optional notes</Label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Used for startups"
              className={styles.textarea}
              rows={3}
              maxLength={500}
            />
          </div>

          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          <div className={styles.formActions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <Button type="submit" disabled={isPending || !selectedFile}>
              {isPending ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

