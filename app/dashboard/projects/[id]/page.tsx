

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getPortfolioItemById } from '@/lib/services/portfolio'
import { notFound, redirect } from 'next/navigation'
import { ProjectDetailView } from '@/components/projects/project-detail-view'

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  const { id } = await params
  const project = await getPortfolioItemById(id, session.user.id)

  if (!project) {
    notFound()
  }

  return <ProjectDetailView project={project} />
}

