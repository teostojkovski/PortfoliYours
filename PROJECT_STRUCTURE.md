# Project Structure

This document explains the organization and purpose of each directory in the Portfoliyours project.

## 📁 Directory Overview

```
portfoliyours/
├── app/                          # Next.js App Router (pages & routes)
│   ├── (auth)/                   # Auth group route
│   │   ├── signin/              # Sign in page
│   │   └── signup/              # Sign up page
│   ├── (dashboard)/             # Protected dashboard routes
│   │   ├── dashboard/           # Main dashboard page
│   │   ├── profile/             # User profile management
│   │   ├── portfolio/           # Portfolio builder
│   │   ├── projects/            # Projects management
│   │   │   ├── github/         # GitHub projects
│   │   │   └── upwork/         # Upwork projects
│   │   ├── experiences/         # Work experience tracking
│   │   ├── applications/        # Job applications tracking
│   │   └── cv/                  # CV/resume management
│   ├── api/                     # API routes
│   │   ├── auth/               # Authentication endpoints
│   │   ├── users/              # User management endpoints
│   │   ├── projects/           # Project endpoints
│   │   └── ...                 # Other feature endpoints
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page
│   └── globals.css              # Global styles
│
├── components/                   # React components
│   ├── ui/                      # Reusable UI primitives (shadcn/ui)
│   ├── auth/                    # Authentication components
│   ├── dashboard/               # Dashboard-specific components
│   ├── profile/                 # Profile components
│   ├── portfolio/              # Portfolio components
│   ├── projects/               # Project components
│   └── layout/                  # Layout components (Header, Footer, etc.)
│
├── lib/                          # Utility libraries
│   ├── auth.ts                  # NextAuth configuration
│   ├── prisma.ts                # Prisma client instance
│   ├── utils.ts                 # General utilities
│   ├── validations.ts           # Zod validation schemas
│   ├── api/                     # API client functions
│   └── constants/               # App constants
│
├── hooks/                        # Custom React hooks
│   ├── use-auth.ts              # Authentication hook
│   ├── use-user.ts              # User data hook
│   └── ...                      # Other feature hooks
│
├── types/                        # TypeScript type definitions
│   ├── index.ts                 # Shared types
│   └── next-auth.d.ts           # NextAuth type extensions
│
├── prisma/                       # Database
│   └── schema.prisma            # Prisma schema
│
├── public/                       # Static assets
│   ├── images/                  # Image assets
│   └── ...                      # Other static files
│
└── constants/                    # App-wide constants
    ├── routes.ts                 # Route definitions
    └── config.ts                 # App configuration
```

## 📄 Key Files Explained

### App Router (`app/`)

- **`page.tsx`** - Landing page (public)
- **`layout.tsx`** - Root layout wrapper for all pages
- **`(auth)/`** - Authentication pages (group route, doesn't affect URL)
- **`(dashboard)/`** - Protected dashboard pages (group route)
- **`api/`** - API route handlers (REST endpoints)

### Components (`components/`)

- **`ui/`** - Base UI components (buttons, inputs, cards, etc.)
- **`auth/`** - Authentication-related components
- **`dashboard/`** - Dashboard-specific components
- **`layout/`** - Shared layout components (Header, Sidebar, etc.)

### Libraries (`lib/`)

- **`auth.ts`** - NextAuth.js configuration
- **`prisma.ts`** - Prisma client singleton
- **`utils.ts`** - Helper functions (cn, formatDate, etc.)
- **`validations.ts`** - Zod schemas for form validation
- **`api/`** - API client functions for server-side data fetching

### Hooks (`hooks/`)

Custom React hooks for shared logic:
- **`use-auth.ts`** - Authentication state and methods
- **`use-user.ts`** - User data fetching and management

### Types (`types/`)

TypeScript type definitions:
- **`index.ts`** - Shared types and interfaces
- **`next-auth.d.ts`** - NextAuth type extensions

## 🛣️ Route Structure

### Public Routes
- `/` - Landing page
- `/auth/signin` - Sign in page
- `/auth/signup` - Sign up page

### Protected Routes (require authentication)
- `/dashboard` - Main dashboard
- `/profile` - User profile management
- `/portfolio` - Portfolio builder
- `/projects/github` - GitHub projects
- `/projects/upwork` - Upwork projects
- `/experiences` - Work experiences
- `/applications` - Job applications
- `/cv` - CV/resume management

### API Routes
- `/api/auth/[...nextauth]` - NextAuth endpoints
- `/api/auth/signup` - User registration
- `/api/users/*` - User management
- `/api/projects/*` - Project management
- `/api/experiences/*` - Experience management
- `/api/applications/*` - Application management

## 🔒 Authentication

Authentication is handled by NextAuth.js. Protected routes are secured via `middleware.ts`.

## 📦 Component Organization

Components are organized by feature to make them easy to find and maintain:
- Feature-specific components live in their feature folder
- Shared UI components live in `components/ui/`
- Layout components live in `components/layout/`

