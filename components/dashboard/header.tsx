/**
 * Dashboard Header Component
 * Top header bar with user info and actions
 */

'use client'

import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import styles from './header.module.css'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/profile': 'Profile',
  '/dashboard/projects': 'Projects',
  '/dashboard/skills': 'Skills',
  '/dashboard/experience': 'Experience',
  '/dashboard/cvs': 'CVs',
  '/dashboard/applications': 'Applications',
  '/dashboard/public-profile': 'Public Profile',
  '/dashboard/settings': 'Settings',
}

export function DashboardHeader() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const pageTitle = pageTitles[pathname] || 'Dashboard'

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.headerLeft}>
          <h1 className={styles.headerTitle}>{pageTitle}</h1>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.userName}>{session?.user?.name || 'User'}</span>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className={styles.signOutButton}
            aria-label="Sign out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  )
}

