

'use client'

import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import styles from './header.module.css'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/profile': 'Profile',
  '/dashboard/projects': 'Projects',
  '/dashboard/skills': 'Skills',
  '/dashboard/experience': 'Experience',
  '/dashboard/cvs': 'Documents',
  '/dashboard/applications': 'Applications',
  '/dashboard/public-profile': 'Public Profile',
  '/dashboard/settings': 'Settings',
}

export function DashboardHeader() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const pageTitle = pageTitles[pathname] || 'Dashboard'
  const [userName, setUserName] = useState(session?.user?.name || 'User')

  useEffect(() => {
    if (session?.user?.name) {
      setUserName(session.user.name)
    }
  }, [session?.user?.name])

  useEffect(() => {
    const handleUserNameUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{ fullName: string }>
      setUserName(customEvent.detail.fullName)
    }

    window.addEventListener('userNameUpdated', handleUserNameUpdate as EventListener)
    return () => {
      window.removeEventListener('userNameUpdated', handleUserNameUpdate as EventListener)
    }
  }, [])

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.headerLeft}>
          <h1 className={styles.headerTitle}>{pageTitle}</h1>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.userName}>{userName}</span>
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

