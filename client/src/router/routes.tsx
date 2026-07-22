import { createRootRoute, createRoute, Outlet, redirect } from '@tanstack/react-router';
import { ROUTES } from '@/lib/constants';
import Home from '@/pages/Home';
import ErrorPage from '@/pages/ErrorPage';
import NotFoundPage from '@/pages/NotFoundPage';
import Dashboard from '@/pages/Dashboard';
import RegisterPage from '@/pages/auth/RegisterPage';
import LoginPage from '@/pages/auth/LoginPage';
import { useAuthStore } from '@/store/auth';

export const rootRoute = createRootRoute({
  component: Outlet,
  errorComponent: ErrorPage,
  notFoundComponent: NotFoundPage,
  beforeLoad: async () => {
    const store = useAuthStore.getState();
    if (!store.isAuthenticated && !store.hasAttemptedRefresh) {
      try {
        await store.refresh();
      } catch (err) {
        console.warn('Initial session refresh check failed:', err);
      } finally {
        store.setHasAttemptedRefresh(true);
      }
    }
  },
});

export const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.root,
  component: Home,
});

export const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.register,
  component: RegisterPage,
  beforeLoad: async () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (isAuthenticated) {
      throw redirect({
        to: ROUTES.dashboard,
      });
    }
  },
});

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.login,
  component: LoginPage,
  beforeLoad: async () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (isAuthenticated) {
      throw redirect({
        to: ROUTES.dashboard,
      });
    }
  },
});

// Pathless layout route for protecting nested routes
export const protectedLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: '_protected',
  component: Outlet,
  beforeLoad: async () => {
    const { isAuthenticated, getCurrentUser } = useAuthStore.getState();

    if (!isAuthenticated) {
      throw redirect({
        to: ROUTES.root,
      });
    }

    try {
      await getCurrentUser();
    } catch {
      throw redirect({
        to: ROUTES.root,
      });
    }
  },
});

export const dashboardRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: ROUTES.dashboard,
  component: Dashboard,
});
