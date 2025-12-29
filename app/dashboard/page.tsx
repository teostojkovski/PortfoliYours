import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDashboardData } from '@/lib/services/dashboard'
import { DashboardClient } from '@/components/dashboard/dashboard-client'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return <div>Unauthorized</div>
  }

  const dashboardData = await getDashboardData(session.user.id)

  const getFirstName = (fullName: string | null | undefined): string => {
    if (!fullName) return 'User'
    const nameParts = fullName.trim().split(/\s+/)
    return nameParts[0] || 'User'
  }

  return (
    <DashboardClient
      userName={getFirstName(session.user.name)}
      dashboardData={dashboardData}
    />
  )
}
