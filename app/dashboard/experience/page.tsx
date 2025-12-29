

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getExperiencesByUserId } from '@/lib/services/experience'
import { ExperiencePageClient } from '@/components/experience/experience-page-client'

export default async function ExperiencePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return <div>Unauthorized</div>
  }

  const experiences = await getExperiencesByUserId(session.user.id)

  return <ExperiencePageClient experiences={experiences} />
}
