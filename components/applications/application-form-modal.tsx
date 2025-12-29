

'use client'

import { useState, useTransition, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import styles from './application-form-modal.module.css'

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
}

interface ApplicationFormModalProps {
  application?: Application | null
  onClose: () => void
  onSuccess: () => void
}

export function ApplicationFormModal({ application, onClose, onSuccess }: ApplicationFormModalProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState(1)
  const [availableDocuments, setAvailableDocuments] = useState<Array<{ id: string; name: string; type: string }>>([])

  const [formData, setFormData] = useState({
    company: application?.company || '',
    role: application?.role || '',
    location: application?.location || '',
    status: application?.status || 'draft',
    appliedAt: application?.appliedAt ? new Date(application.appliedAt).toISOString().split('T')[0] : '',
    link: application?.link || '',
    notes: application?.notes || '',
    recruiterName: application?.recruiterName || '',
    recruiterEmail: application?.recruiterEmail || '',
    followUpAt: application?.followUpAt ? new Date(application.followUpAt).toISOString().split('T')[0] : '',
    cvDocumentId: '',
    coverLetterDocumentId: '',
    cvFile: null as File | null,
    coverLetterFile: null as File | null,
    saveCvToDocuments: false,
    saveCoverLetterToDocuments: false,
  })

  useEffect(() => {

    fetch('/api/documents')
      .then((res) => res.json())
      .then((data) => {
        if (data.documents) {
          setAvailableDocuments(data.documents)
        }
      })
      .catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (step < 3) {
      setStep(step + 1)
      return
    }

    startTransition(async () => {
      try {
        const uploadData = new FormData()
        uploadData.append('company', formData.company)
        uploadData.append('role', formData.role)
        uploadData.append('location', formData.location || '')
        uploadData.append('status', formData.status)
        uploadData.append('appliedAt', formData.appliedAt || '')
        uploadData.append('link', formData.link || '')
        uploadData.append('notes', formData.notes || '')
        uploadData.append('recruiterName', formData.recruiterName || '')
        uploadData.append('recruiterEmail', formData.recruiterEmail || '')
        uploadData.append('followUpAt', formData.followUpAt || '')
        uploadData.append('cvDocumentId', formData.cvDocumentId || '')
        uploadData.append('coverLetterDocumentId', formData.coverLetterDocumentId || '')
        uploadData.append('saveCvToDocuments', String(formData.saveCvToDocuments))
        uploadData.append('saveCoverLetterToDocuments', String(formData.saveCoverLetterToDocuments))

        if (formData.cvFile) {
          uploadData.append('cvFile', formData.cvFile)
        }
        if (formData.coverLetterFile) {
          uploadData.append('coverLetterFile', formData.coverLetterFile)
        }

        const url = application ? `/api/applications/${application.id}` : '/api/applications'
        const method = application ? 'PUT' : 'POST'

        const response = await fetch(url, {
          method,
          body: uploadData,
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.error || 'Failed to save application')
          return
        }

        onSuccess()
        onClose()
      } catch (err) {
        setError('An error occurred. Please try again.')
      }
    })
  }

  const renderStep1 = () => (
    <div className={styles.stepContent}>
      <h3 className={styles.stepTitle}>Core Information</h3>
      <div className={styles.formGrid}>
        <div className={styles.formField}>
          <Label htmlFor="company">Company name</Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="Stripe"
            required
          />
        </div>

        <div className={styles.formField}>
          <Label htmlFor="role">Role title</Label>
          <Input
            id="role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            placeholder="Frontend Engineer"
            required
          />
        </div>

        <div className={styles.formField}>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Remote"
          />
        </div>

        <div className={styles.formField}>
          <Label htmlFor="link">Application link</Label>
          <Input
            id="link"
            type="url"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            placeholder="https://..."
          />
        </div>

        <div className={styles.formField}>
          <Label htmlFor="appliedAt">Applied date</Label>
          <DatePicker
            id="appliedAt"
            value={formData.appliedAt}
            onChange={(e) => setFormData({ ...formData, appliedAt: e.target.value })}
          />
        </div>

        <div className={styles.formField}>
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className={styles.select}
            required
          >
            <option value="draft">Draft</option>
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
            <option value="withdrawn">Withdrawn</option>
          </select>
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className={styles.stepContent}>
      <h3 className={styles.stepTitle}>Documents</h3>
      
      <div className={styles.formField}>
        <Label htmlFor="cvDocumentId">CV</Label>
        <select
          id="cvDocumentId"
          value={formData.cvDocumentId}
          onChange={(e) => setFormData({ ...formData, cvDocumentId: e.target.value, cvFile: null })}
          className={styles.select}
        >
          <option value="">Select existing CV</option>
          {availableDocuments.filter((d) => d.type === 'CV').map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.name}
            </option>
          ))}
        </select>
        <p className={styles.orText}>OR</p>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              setFormData({ ...formData, cvFile: file, cvDocumentId: '' })
            }
          }}
          className={styles.fileInput}
        />
        {formData.cvFile && (
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={formData.saveCvToDocuments}
              onChange={(e) => setFormData({ ...formData, saveCvToDocuments: e.target.checked })}
            />
            <span>Add this document to CVs after saving</span>
          </label>
        )}
      </div>

      <div className={styles.formField}>
        <Label htmlFor="coverLetterDocumentId">Cover Letter (optional)</Label>
        <select
          id="coverLetterDocumentId"
          value={formData.coverLetterDocumentId}
          onChange={(e) => setFormData({ ...formData, coverLetterDocumentId: e.target.value, coverLetterFile: null })}
          className={styles.select}
        >
          <option value="">Select existing cover letter</option>
          {availableDocuments.filter((d) => d.type === 'COVER_LETTER').map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.name}
            </option>
          ))}
        </select>
        <p className={styles.orText}>OR</p>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              setFormData({ ...formData, coverLetterFile: file, coverLetterDocumentId: '' })
            }
          }}
          className={styles.fileInput}
        />
        {formData.coverLetterFile && (
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={formData.saveCoverLetterToDocuments}
              onChange={(e) => setFormData({ ...formData, saveCoverLetterToDocuments: e.target.checked })}
            />
            <span>Add this document to CVs after saving</span>
          </label>
        )}
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className={styles.stepContent}>
      <h3 className={styles.stepTitle}>Optional Metadata</h3>
      <div className={styles.formGrid}>
        <div className={styles.formField}>
          <Label htmlFor="recruiterName">Recruiter name</Label>
          <Input
            id="recruiterName"
            value={formData.recruiterName}
            onChange={(e) => setFormData({ ...formData, recruiterName: e.target.value })}
            placeholder="Optional"
          />
        </div>

        <div className={styles.formField}>
          <Label htmlFor="recruiterEmail">Recruiter email</Label>
          <Input
            id="recruiterEmail"
            type="email"
            value={formData.recruiterEmail}
            onChange={(e) => setFormData({ ...formData, recruiterEmail: e.target.value })}
            placeholder="Optional"
          />
        </div>

        <div className={styles.formFieldFull}>
          <Label htmlFor="notes">Notes</Label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="e.g. Referred by Alex"
            className={styles.textarea}
            rows={4}
          />
        </div>

        <div className={styles.formField}>
          <Label htmlFor="followUpAt">Follow-up date</Label>
          <DatePicker
            id="followUpAt"
            value={formData.followUpAt}
            onChange={(e) => setFormData({ ...formData, followUpAt: e.target.value })}
          />
        </div>
      </div>
    </div>
  )

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <Card className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {application ? 'Edit Application' : 'New Application'}
          </h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div className={styles.stepIndicator}>
          <div className={`${styles.step} ${step >= 1 ? styles.stepActive : ''}`}>1</div>
          <div className={styles.stepLine}></div>
          <div className={`${styles.step} ${step >= 2 ? styles.stepActive : ''}`}>2</div>
          <div className={styles.stepLine}></div>
          <div className={`${styles.step} ${step >= 3 ? styles.stepActive : ''}`}>3</div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}

          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          <div className={styles.formActions}>
            {step > 1 && (
              <button
                type="button"
                className={styles.backButton}
                onClick={() => setStep(step - 1)}
              >
                Back
              </button>
            )}
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <Button type="submit" disabled={isPending}>
              {step < 3 ? 'Next' : isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

