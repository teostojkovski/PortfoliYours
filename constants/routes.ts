/**
 * Application route definitions
 * Centralized route constants for type safety and easy refactoring
 */

export const ROUTES = {
  // Public routes
  HOME: '/',
  SIGN_IN: '/auth/signin',
  SIGN_UP: '/auth/signup',

  // Protected routes
  DASHBOARD: '/dashboard',
  PROFILE: '/dashboard/profile',
  PORTFOLIO: '/portfolio',
  CV: '/dashboard/cvs',
  EXPERIENCES: '/dashboard/experience',
  APPLICATIONS: '/dashboard/applications',

  // Project routes
  PROJECTS: {
    BASE: '/projects',
    GITHUB: '/projects/github',
    UPWORK: '/projects/upwork',
  },

  // API routes
  API: {
    AUTH: {
      BASE: '/api/auth',
      SIGNUP: '/api/auth/signup',
      SIGNIN: '/api/auth/signin',
      SIGNOUT: '/api/auth/signout',
    },
    USERS: '/api/users',
    PROJECTS: '/api/projects',
    EXPERIENCES: '/api/experiences',
    APPLICATIONS: '/api/applications',
    CV: '/api/cv',
    PORTFOLIO: '/api/portfolio',
  },
} as const

