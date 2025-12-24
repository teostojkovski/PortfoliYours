/**
 * Header Component
 * Main navigation header for the application
 * Used in authenticated dashboard pages
 */

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'

export function Header() {
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href={ROUTES.DASHBOARD} className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Portfoliyours"
            width={120}
            height={40}
            className="h-8 w-auto"
          />
        </Link>
        <nav className="flex items-center gap-4">
          <Link href={ROUTES.DASHBOARD}>Dashboard</Link>
          <Link href={ROUTES.PROFILE}>Profile</Link>
          <Link href={ROUTES.PORTFOLIO}>Portfolio</Link>
        </nav>
      </div>
    </header>
  )
}

