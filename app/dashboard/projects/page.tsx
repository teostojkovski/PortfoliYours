

import { Suspense } from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getPortfolioItemsByUserId } from '@/lib/services/portfolio'
import { ProjectsPageClient } from '@/components/projects/projects-page-client'

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return <div>Unauthorized</div>
  }

  const projects = await getPortfolioItemsByUserId(session.user.id)

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProjectsPageClient initialProjects={projects} />
    </Suspense>
  )
}
