import { dashboardRoute, homeRoute, rootRoute } from "@/router/routes";

export const routeTree = rootRoute.addChildren([homeRoute, dashboardRoute]);
