

'use client'

import { useState, useTransition } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'
import styles from '../settings-section.module.css'

export function SecuritySettings() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    startTransition(async () => {
      try {
        const response = await fetch('/api/user/password', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.error || 'Failed to change password')
          return
        }

        setSuccess(true)
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
        setTimeout(() => setSuccess(false), 3000)
      } catch (err) {
        setError('An error occurred. Please try again.')
      }
    })
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/auth/signin' })
  }

  return (
    <div className={styles.section}>
      <Card className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>Change Password</h2>

        <form onSubmit={handlePasswordChange} className={styles.form}>
          <div className={styles.formField}>
            <Label htmlFor="currentPassword">Current password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              required
            />
          </div>

          <div className={styles.formField}>
            <Label htmlFor="newPassword">New password</Label>
            <Input
              id="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              required
              minLength={8}
            />
            <p className={styles.fieldHint}>Password must be at least 8 characters</p>
          </div>

          <div className={styles.formField}>
            <Label htmlFor="confirmPassword">Confirm new password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              required
              minLength={8}
            />
          </div>

          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          {success && (
            <div className={styles.successMessage}>
              Password changed successfully!
            </div>
          )}

          <div className={styles.formActions}>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Changing...' : 'Change Password'}
            </Button>
          </div>
        </form>
      </Card>

      <Card className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>Sign Out</h2>
        <div className={styles.sessionSection}>
          <div>
            <p className={styles.sessionInfo}>
              Sign out of your account on this device
            </p>
          </div>
          <button
            type="button"
            className={styles.logoutButton}
            onClick={handleLogout}
          >
            Sign Out
          </button>
        </div>
      </Card>
    </div>
  )
}
