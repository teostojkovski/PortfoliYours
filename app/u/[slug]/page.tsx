/**
 * Public Profile Page
 * Route: /u/[slug]
 * Read-only public profile view
 */

import { notFound } from 'next/navigation'
import { getPublicProfileBySlug } from '@/lib/services/public-profile'
import { PublicProfileView } from '@/components/public-profile/public-profile-view'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const publicProfile = await getPublicProfileBySlug(params.slug)

  if (!publicProfile || !publicProfile.enabled) {
    return {
      title: 'Profile Not Found',
      robots: 'noindex, nofollow',
    }
  }

  const user = publicProfile.user
  const profile = user.profile

  return {
    title: `${user.fullName} - ${profile?.title || 'Portfolio'}`,
    description: profile?.bio || `${user.fullName}'s professional portfolio`,
    robots: publicProfile.seoIndexable ? 'index, follow' : 'noindex, nofollow',
  }
}

export default async function PublicProfilePage({ params }: { params: { slug: string } }) {
  const publicProfile = await getPublicProfileBySlug(params.slug)

  if (!publicProfile || !publicProfile.enabled) {
    notFound()
  }

  return <PublicProfileView publicProfile={publicProfile} />
}

