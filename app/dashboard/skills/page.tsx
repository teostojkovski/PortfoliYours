/**
 * Skills Page
 * Route: /dashboard/skills
 * Manage skills with categories and project linking
 */

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getSkillsGroupedByCategory } from '@/lib/services/skills'
import { SkillsPageClient } from '@/components/skills/skills-page-client'

export default async function SkillsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return <div>Unauthorized</div>
  }

  const { grouped, categories, skills } = await getSkillsGroupedByCategory(session.user.id)

  // Calculate warnings
  const skillsWithoutProjects = skills.filter(
    (skill) => skill.projectSkills.length === 0
  ).length

  const oldSkills = skills.filter((skill) => {
    if (!skill.lastUsedAt) return false
    const threeYearsAgo = new Date()
    threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3)
    return skill.lastUsedAt < threeYearsAgo
  }).length

  return (
    <SkillsPageClient
      grouped={grouped}
      categories={categories}
      skillsWithoutProjects={skillsWithoutProjects}
      oldSkills={oldSkills}
    />
  )
}
