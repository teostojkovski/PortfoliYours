/**
 * Settings Page
 * Route: /dashboard/settings
 * Configure app preferences and account settings
 */

'use client'

import { useTheme } from '@/hooks/use-theme'
import { Card } from '@/components/ui/card'
import styles from './settings.module.css'

export default function SettingsPage() {
  const { theme, toggleTheme, mounted } = useTheme()

  if (!mounted) {
    return null
  }

  return (
    <div className={styles.settingsPage}>
      <Card className={styles.settingsCard}>
        <h2 className={styles.sectionTitle}>Appearance</h2>
        <div className={styles.settingItem}>
          <div className={styles.settingInfo}>
            <h3 className={styles.settingLabel}>Theme</h3>
            <p className={styles.settingDescription}>
              Choose between light and dark mode
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className={styles.themeToggle}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            <span className={styles.themeToggleLabel}>
              {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </span>
          </button>
        </div>
      </Card>
    </div>
  )
}
