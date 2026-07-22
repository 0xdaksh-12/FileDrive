import { dashboardRoute, homeRoute, rootRoute, registerRoute, protectedLayoutRoute } from '@/router/routes';

export const routeTree = rootRoute.addChildren([
  homeRoute,
  registerRoute,
  protectedLayoutRoute.addChildren([dashboardRoute]),
]);
