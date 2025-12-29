

'use client'

import { useState } from 'react'
import { AccountSettings } from './sections/account-settings'
import { PublicProfileSettings } from '@/components/public-profile/public-profile-settings'
import { SecuritySettings } from './sections/security-settings'
import styles from './settings-view.module.css'

interface User {
  id: string
  email: string
  fullName: string
  publicProfile: {
    id: string
    slug: string
    enabled: boolean
    seoIndexable: boolean
    showProfile: boolean
    showSkills: boolean
    showExperience: boolean
    showProjects: boolean
    showContact: boolean
    allowCvRequest: boolean
    selectedProjectIds: string[]
  } | null
}

interface SettingsViewProps {
  user: User
}

type SettingsSection = 'account' | 'public' | 'security'

export function SettingsView({ user }: SettingsViewProps) {
  const [activeSection, setActiveSection] = useState<SettingsSection>('account')

  const sections: Array<{ id: SettingsSection; label: string }> = [
    { id: 'account', label: 'Account' },
    { id: 'public', label: 'Public Profile' },
    { id: 'security', label: 'Security' },
  ]

  const renderSection = () => {
    switch (activeSection) {
      case 'account':
        return <AccountSettings user={user} />
      case 'public':
        return <PublicProfileSettings publicProfile={user.publicProfile} />
      case 'security':
        return <SecuritySettings />
      default:
        return <AccountSettings user={user} />
    }
  }

  return (
    <div className={styles.settingsPage}>
      <div className={styles.settingsHeader}>
        <p className={styles.pageDescription}>
          Manage your account and preferences
        </p>
      </div>

      <div className={styles.settingsContainer}>
        <nav className={styles.settingsNav}>
          {sections.map((section) => (
            <button
              key={section.id}
              className={`${styles.navItem} ${activeSection === section.id ? styles.navItemActive : ''}`}
              onClick={() => setActiveSection(section.id)}
            >
              {section.label}
            </button>
          ))}
        </nav>

        <div className={styles.settingsContent}>
          {renderSection()}
        </div>
      </div>
    </div>
  )
}
