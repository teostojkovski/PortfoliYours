export const ROUTES = {
  HOME: '/',
  SIGN_IN: '/auth/signin',
  SIGN_UP: '/auth/signup',
  DASHBOARD: '/dashboard',
  PROFILE: '/dashboard/profile',
  PORTFOLIO: '/portfolio',
  CV: '/dashboard/cvs',
  EXPERIENCES: '/dashboard/experience',
  APPLICATIONS: '/dashboard/applications',
  PROJECTS: {
    BASE: '/projects',
    GITHUB: '/projects/github',
    UPWORK: '/projects/upwork',
  },
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

