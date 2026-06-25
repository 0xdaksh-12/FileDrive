export const ROUTES = {
  root: "/",
  dashboard: "/dashboard",
} as const;

export const API_ENDPOINTS = {
  common: {
    health: "/api/health",
  },
} as const;

export const QUERY_KEYS = {
  health: ["health"] as const,
};

export const APP_NAME = "FileDrive";
