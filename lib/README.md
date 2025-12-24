# Lib Directory

Utility functions, configurations, and shared libraries.

## Structure

```
lib/
├── auth.ts            # NextAuth.js configuration
├── prisma.ts          # Prisma client singleton
├── utils.ts           # General utility functions
├── validations.ts     # Zod validation schemas
└── api/              # API client functions (if needed)
```

## Files

- **`auth.ts`**: NextAuth.js configuration and options
- **`prisma.ts`**: Prisma client instance (singleton pattern)
- **`utils.ts`**: Helper functions (cn, formatDate, formatFileSize, etc.)
- **`validations.ts`**: Zod schemas for form validation and API validation

## Usage

```tsx
// Import utilities
import { cn, formatDate } from '@/lib/utils'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { signupSchema } from '@/lib/validations'
```

