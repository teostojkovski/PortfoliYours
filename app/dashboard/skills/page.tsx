

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getSkillsGroupedByCategory } from '@/lib/services/skills'
import { SkillsPageClient } from '@/components/skills/skills-page-client'

export default async function SkillsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return <div>Unauthorized</div>
  }

  const { grouped, categories } = await getSkillsGroupedByCategory(session.user.id)

  return (
    <SkillsPageClient
      grouped={grouped}
      categories={categories}
      skillsWithoutProjects={0}
      oldSkills={0}
    />
  )
}
