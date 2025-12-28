/**
 * Dashboard Sidebar Component
 * Persistent sidebar navigation for dashboard sections
 */

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import {
  LayoutDashboard,
  User,
  FolderKanban,
  Code,
  Briefcase,
  FileText,
  Send,
  Settings,
  Eye,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { ROUTES } from '@/constants/routes'
import { useSidebar } from './sidebar-context'
import styles from './sidebar.module.css'

const baseNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: ROUTES.DASHBOARD },
  { icon: User, label: 'Profile', href: '/dashboard/profile' },
  { icon: FolderKanban, label: 'Projects', href: '/dashboard/projects' },
  { icon: Code, label: 'Skills', href: '/dashboard/skills' },
  { icon: Briefcase, label: 'Experience', href: ROUTES.EXPERIENCES },
  { icon: FileText, label: 'Documents', href: ROUTES.CV },
  { icon: Send, label: 'Applications', href: ROUTES.APPLICATIONS },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { isCollapsed, toggleSidebar } = useSidebar()
  const { data: session } = useSession()
  const [publicProfileEnabled, setPublicProfileEnabled] = useState(false)

  useEffect(() => {
    if (session?.user?.id) {
      // Check if public profile is enabled
      const checkPublicProfile = () => {
        fetch('/api/public-profile')
          .then(res => res.json())
          .then(data => {
            if (data.publicProfile?.enabled) {
              setPublicProfileEnabled(true)
            } else {
              setPublicProfileEnabled(false)
            }
          })
          .catch(() => {
            setPublicProfileEnabled(false)
          })
      }

      // Check immediately and whenever pathname changes
      // This ensures the tab appears when they enable it in settings and navigate back
      checkPublicProfile()
    }
  }, [session, pathname])

  // Build nav items dynamically based on public profile status
  const navItems = [
    ...baseNavItems.slice(0, 7), // All items before Settings
    ...(publicProfileEnabled ? [{ icon: Eye, label: 'Public Profile', href: '/dashboard/public-profile' }] : []),
    baseNavItems[7], // Settings always last
  ]

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.sidebarCollapsed : ''}`}>
      <div className={styles.sidebarHeader}>
        <Link href={ROUTES.DASHBOARD} className={styles.sidebarLogo}>
          {isCollapsed ? (
            <Image
              src="/logoP.png"
              alt="Portfoliyours"
              width={40}
              height={40}
              className={styles.logoImageCollapsed}
              priority
            />
          ) : (
            <Image
              src="/logo.png"
              alt="Portfoliyours"
              width={140}
              height={40}
              className={styles.logoImage}
              priority
            />
          )}
        </Link>
      </div>
      <nav className={styles.sidebarNav}>
        {navItems.map((item) => {
          const Icon = item.icon
          // Fix: Only mark as active if it's an exact match or a child route (but not if dashboard is parent of everything)
          const isActive = item.href === ROUTES.DASHBOARD
            ? pathname === ROUTES.DASHBOARD
            : pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={styles.navIcon} size={20} />
              {!isCollapsed && <span className={styles.navLabel}>{item.label}</span>}
            </Link>
          )
        })}
      </nav>
      <button
        onClick={toggleSidebar}
        className={styles.collapseButton}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>
    </aside>
  )
}
