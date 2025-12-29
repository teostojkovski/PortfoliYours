

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PublicProfileBuilder } from '@/components/public-profile/public-profile-builder'

export default async function PublicProfileBuilderPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return <div>Unauthorized</div>
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      profile: true,
      publicProfile: true,
      portfolioItems: {
        orderBy: { createdAt: 'desc' },
      },
      experiences: {
        orderBy: { startDate: 'desc' },
        include: {
          experienceProjects: true,
        },
      },
      documents: {
        where: { type: 'CV' },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!user) {
    return <div>User not found</div>
  }

  return <PublicProfileBuilder user={user} />
}
