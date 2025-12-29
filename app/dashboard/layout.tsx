

'use client'

import { ReactNode } from 'react'
import { SidebarProvider, useSidebar } from '@/components/dashboard/sidebar-context'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/header'
import styles from './dashboard.module.css'

function DashboardContent({ children }: { children: ReactNode }) {
  const { isCollapsed } = useSidebar()

  return (
    <div className={styles.dashboardContainer}>
      <DashboardSidebar />
      <div className={`${styles.dashboardContent} ${isCollapsed ? styles.dashboardContentCollapsed : ''}`}>
        <DashboardHeader />
        <main className={styles.dashboardMain}>{children}</main>
      </div>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  )
}

