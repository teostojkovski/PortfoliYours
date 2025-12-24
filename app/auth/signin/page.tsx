/**
 * Sign In Page
 * Route: /auth/signin
 * Public page for user authentication
 */

import Link from 'next/link'
import Image from 'next/image'
import { SignInForm } from '@/components/auth/signin-form'
import { ROUTES } from '@/constants/routes'
import styles from '../auth.module.css'

export default function SignInPage() {
  return (
    <div className={styles.authContainer}>
      {/* Logo */}
      <div className={styles.logoContainer}>
        <Link href="/" className={styles.logoLink}>
          <Image
            src="/logo.png"
            alt="Portfoliyours Logo"
            width={100}
            height={32}
            className={styles.logo}
            priority
            quality={100}
          />
        </Link>
      </div>

      {/* Auth Content */}
      <div className={styles.authContent}>
        <div className={styles.authHeader}>
          <h1 className={styles.authTitle}>Sign In</h1>
          <p className={styles.authSubtitle}>
            Welcome back! Sign in to your account.
          </p>
        </div>
        <SignInForm />
        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account?{' '}
          <Link href={ROUTES.SIGN_UP} className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

