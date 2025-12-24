/**
 * Profile Page
 * Route: /dashboard/profile
 * Manage user identity, contact info, and social links
 */

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getProfileByUserId } from '@/lib/services/profile'
import { prisma } from '@/lib/prisma'
import { ProfileForm } from '@/components/profile/profile-form'
import styles from './profile.module.css'

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return <div>Unauthorized</div>
  }

  // Get user with profile
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { profile: true },
  })

  if (!user) {
    return <div>User not found</div>
  }

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileHeader}>
        <h1 className={styles.pageTitle}>Profile</h1>
        <p className={styles.pageDescription}>
          Manage your identity and contact information
        </p>
      </div>

      <ProfileForm user={user} />
    </div>
  )
}
