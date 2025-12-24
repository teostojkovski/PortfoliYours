# App Directory

This directory contains all Next.js App Router pages and API routes.

## Structure

```
app/
├── (auth)/              # Auth route group (doesn't affect URL)
│   ├── signin/         # /auth/signin
│   └── signup/         # /auth/signup
├── (dashboard)/         # Protected dashboard routes
│   ├── dashboard/      # /dashboard
│   ├── profile/        # /profile
│   ├── portfolio/      # /portfolio
│   ├── projects/       # /projects/*
│   ├── experiences/    # /experiences
│   ├── applications/   # /applications
│   └── cv/             # /cv
├── api/                 # API route handlers
│   ├── auth/           # Authentication endpoints
│   └── ...             # Other feature endpoints
├── layout.tsx          # Root layout
├── page.tsx            # Landing page (/)
└── globals.css         # Global styles
```

## Route Groups

Route groups `(auth)` and `(dashboard)` are used for organization without affecting URLs. They allow:
- Shared layouts per group
- Better organization
- Conditional layouts/middleware

## Pages

Each page file should:
- Export a default React component
- Include a JSDoc comment explaining the route
- Be a Server Component by default (use `'use client'` only when needed)

## API Routes

API routes in `app/api/` handle:
- Authentication (`/api/auth/*`)
- User management (`/api/users/*`)
- Feature-specific endpoints (`/api/projects/*`, etc.)

