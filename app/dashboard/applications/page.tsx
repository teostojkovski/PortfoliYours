

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getApplicationsByUserId } from '@/lib/services/application'
import { ApplicationsList } from '@/components/applications/applications-list'

export default async function ApplicationsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return <div>Unauthorized</div>
  }

  const applications = await getApplicationsByUserId(session.user.id)

  return <ApplicationsList applications={applications} />
}
