/**
 * Account Settings Section
 * Basic identity and account information
 */

'use client'

import { useState, useTransition } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import styles from '../settings-section.module.css'

interface User {
  id: string
  email: string
  fullName: string
}

interface AccountSettingsProps {
  user: User
}

export function AccountSettings({ user }: AccountSettingsProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    fullName: user.fullName,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    startTransition(async () => {
      try {
        const response = await fetch('/api/user', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fullName: formData.fullName }),
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.error || 'Failed to update account')
          return
        }

        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } catch (err) {
        setError('An error occurred. Please try again.')
      }
    })
  }

  return (
    <div className={styles.section}>
      <Card className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>Account Information</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formField}>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={user.email}
              disabled
            />
            <p className={styles.fieldHint}>Email cannot be changed</p>
          </div>

          <div className={styles.formField}>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
              minLength={1}
            />
          </div>

          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          {success && (
            <div className={styles.successMessage}>
              Account updated successfully!
            </div>
          )}

          <div className={styles.formActions}>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
