

import Link from 'next/link'
import Image from 'next/image'
import { SignUpForm } from '@/components/auth/signup-form'
import { ROUTES } from '@/constants/routes'
import styles from '../auth.module.css'

export default function SignUpPage() {
  return (
    <div className={styles.authContainer}>
      {}
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

      {}
      <div className={styles.authContent}>
        <div className={styles.authHeader}>
          <h1 className={styles.authTitle}>Create Account</h1>
          <p className={styles.authSubtitle}>
            Sign up to start building your portfolio
          </p>
        </div>
        <SignUpForm />
        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{' '}
          <Link href={ROUTES.SIGN_IN} className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

