import { createRootRoute, createRoute, Outlet } from "@tanstack/react-router";
import { ROUTES } from "@/lib/constants";
import Home from "@/pages/Home";
import ErrorPage from "@/pages/ErrorPage";
import NotFoundPage from "@/pages/NotFoundPage";
import Dashboard from "@/pages/Dashboard";

export const rootRoute = createRootRoute({
  component: Outlet,
  errorComponent: ErrorPage,
  notFoundComponent: NotFoundPage,
});

export const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.root,
  component: Home,
});

export const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.dashboard,
  component: Dashboard,
});
