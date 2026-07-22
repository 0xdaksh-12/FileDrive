import { dashboardRoute, homeRoute, rootRoute, registerRoute, loginRoute, protectedLayoutRoute } from '@/router/routes';

export const routeTree = rootRoute.addChildren([
  homeRoute,
  registerRoute,
  loginRoute,
  protectedLayoutRoute.addChildren([dashboardRoute]),
]);
