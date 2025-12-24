/**
 * Application configuration constants
 */

export const APP_CONFIG = {
  name: 'Portfoliyours',
  description: 'Your all-in-one career portfolio manager',
  version: '0.1.0',
} as const

export const FILE_UPLOAD_CONFIG = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: {
    cv: ['application/pdf'],
    images: ['image/jpeg', 'image/png', 'image/webp'],
  },
} as const

export const PAGINATION = {
  defaultPageSize: 10,
  maxPageSize: 100,
} as const

