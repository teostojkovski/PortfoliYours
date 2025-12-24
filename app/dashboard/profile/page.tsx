/**
 * Profile Page
 * Route: /dashboard/profile
 * Server component for profile management
 */

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { ProfileForm } from '@/components/profile/profile-form'

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  // Fetch user and profile data
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      email: true,
      fullName: true,
    },
  })

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  })

  if (!user) {
    redirect('/auth/signin')
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="text-2xl font-bold" style={{ marginBottom: '0.5rem', fontFamily: 'var(--font-outfit)' }}>
          Profile
        </h1>
        <p className="text-muted-foreground" style={{ fontFamily: 'var(--font-jakarta)' }}>
          Manage your identity and contact information
        </p>
      </div>
      <ProfileForm
        initialData={profile ? {
          fullName: profile.fullName || user.fullName || '',
          title: profile.title,
          bio: profile.bio,
          location: profile.location,
          phone: profile.phone,
          website: profile.website,
          github: profile.github,
          linkedin: profile.linkedin,
          otherLink: profile.otherLink,
          otherLinkLabel: profile.otherLinkLabel,
          isPublic: profile.isPublic,
        } : undefined}
        userEmail={user.email}
      />
    </div>
  )
}
