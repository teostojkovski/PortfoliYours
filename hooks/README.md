# Hooks Directory

Custom React hooks for shared logic and state management.

## Available Hooks

- **`use-auth.ts`**: Authentication state and session management
- **`use-user.ts`**: User profile data fetching and management

## Usage

```tsx
'use client'

import { useAuth } from '@/hooks/use-auth'
import { useUser } from '@/hooks/use-user'

export function MyComponent() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const { user: userProfile } = useUser()
  
  // ...
}
```

## Guidelines

- Hooks should be reusable across components
- Use TypeScript for type safety
- Handle loading and error states
- Document hook behavior in JSDoc comments

