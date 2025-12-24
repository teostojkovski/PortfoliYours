# Routes Reference

Quick reference guide for all application routes.

## Public Routes

| Route | Description | Component |
|-------|-------------|-----------|
| `/` | Landing page | `app/page.tsx` |
| `/auth/signin` | Sign in page | `app/auth/signin/page.tsx` |
| `/auth/signup` | Sign up page | `app/auth/signup/page.tsx` |

## Protected Routes (Require Authentication)

| Route | Description | Component |
|-------|-------------|-----------|
| `/dashboard` | Main dashboard overview | `app/dashboard/page.tsx` |
| `/profile` | User profile management | `app/profile/page.tsx` |
| `/portfolio` | Portfolio builder | `app/portfolio/page.tsx` |
| `/cv` | CV/resume management | `app/cv/page.tsx` |
| `/experiences` | Work experience tracking | `app/experiences/page.tsx` |
| `/applications` | Job applications tracking | `app/applications/page.tsx` |
| `/projects/github` | GitHub projects management | `app/projects/github/page.tsx` |
| `/projects/upwork` | Upwork projects management | `app/projects/upwork/page.tsx` |

## API Routes

| Route | Method | Description | Handler |
|-------|--------|-------------|---------|
| `/api/auth/[...nextauth]` | GET, POST | NextAuth endpoints | `app/api/auth/[...nextauth]/route.ts` |
| `/api/auth/signup` | POST | User registration | `app/api/auth/signup/route.ts` |

## Route Constants

Use the `ROUTES` constant from `@/constants/routes` for type-safe route references:

```tsx
import { ROUTES } from '@/constants/routes'

// Usage
<Link href={ROUTES.DASHBOARD}>Dashboard</Link>
<Link href={ROUTES.PROJECTS.GITHUB}>GitHub Projects</Link>
```

