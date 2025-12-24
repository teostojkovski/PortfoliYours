/**
 * Custom hook for user data management
 * Handles fetching and managing user profile data
 */

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export interface UserProfile {
  id: string
  email: string
  fullName: string
  dateOfBirth: Date
  county: string
  avatar?: string | null
}

export function useUser() {
  const { data: session } = useSession()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (session?.user?.id) {
      // TODO: Fetch user data from API
      setIsLoading(false)
    }
  }, [session])

  return {
    user,
    isLoading,
  }
}

