# Components Directory

This directory contains all React components organized by feature and purpose.

## Structure

```
components/
├── ui/              # Base UI components (shadcn/ui primitives)
├── auth/            # Authentication components
├── dashboard/       # Dashboard-specific components
├── profile/         # Profile management components
├── portfolio/      # Portfolio builder components
├── projects/        # Project management components
└── layout/          # Layout components (Header, Sidebar, etc.)
```

## Component Guidelines

- **Feature-based organization**: Components are grouped by feature/domain
- **Reusable UI components**: Base UI components live in `ui/`
- **Client components**: Use `'use client'` directive when needed (interactivity, hooks, browser APIs)
- **Server components**: Default to server components when possible for better performance
- **Naming**: Use PascalCase for component files and exports

## Usage

```tsx
// Import UI components
import { Button } from '@/components/ui/button'

// Import feature components
import { SignInForm } from '@/components/auth/signin-form'
import { Header } from '@/components/layout/header'
```

