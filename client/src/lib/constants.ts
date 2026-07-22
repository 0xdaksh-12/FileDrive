export const ROUTES = {
  root: '/',
  dashboard: '/dashboard',
  register: '/register',
} as const;

export const API_ENDPOINTS = {
  common: {
    health: '/api/health',
  },
  auth: {
    login: '/api/auth/login',
    refresh: '/api/auth/refresh',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
  },
  user: {
    user: '/api/user',
  },
} as const;

export const QUERY_KEYS = {
  health: ['health'] as const,
};

export const APP_NAME = 'FileDrive';
