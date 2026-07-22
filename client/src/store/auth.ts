import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { authChannel } from '@/lib/auth-channel';
import {
  loginApi,
  registerApi,
  logoutApi,
  newAccessTokenApi,
  getCurrentUserApi,
  type LoginCrediental,
  type RegisterCrediental,
  type User,
} from '@/api/account.api';

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  hasAttemptedRefresh: boolean;

  setToken: (accessToken: string | null) => void;
  setUser: (user: User | null) => void;
  login: (credential: LoginCrediental) => Promise<void>;
  register: (credential: RegisterCrediental) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  clear: () => void;
  setHasAttemptedRefresh: (val: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      hasAttemptedRefresh: false,

      setHasAttemptedRefresh: (val: boolean) => {
        set(() => ({ hasAttemptedRefresh: val }));
      },

      setToken: (accessToken: string | null) => {
        set(() => ({ accessToken }));
      },
      setUser: (user: User | null) => {
        set(() => ({ user, isAuthenticated: !!user }));
      },

      login: async (credential: LoginCrediental) => {
        set({ isLoading: true });
        try {
          const res = await loginApi(credential);
          get().setToken(res.accessToken);
          await get().getCurrentUser();

          const currentUser = get().user;
          const token = get().accessToken;
          if (currentUser && token) {
            authChannel?.postMessage({
              type: 'LOGIN',
              payload: { user: currentUser, accessToken: token },
            });
          }
        } catch (error) {
          get().clear();
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (credential: RegisterCrediental) => {
        set({ isLoading: true });
        try {
          const res = await registerApi(credential);
          get().setToken(res.accessToken);
          await get().getCurrentUser();

          const currentUser = get().user;
          const token = get().accessToken;
          if (currentUser && token) {
            authChannel?.postMessage({
              type: 'LOGIN',
              payload: { user: currentUser, accessToken: token },
            });
          }
        } catch (error) {
          get().clear();
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      refresh: async () => {
        set({ isLoading: true });
        try {
          const res = await newAccessTokenApi();
          get().setToken(res.accessToken);
          await get().getCurrentUser();

          const token = get().accessToken;
          if (token) {
            authChannel?.postMessage({
              type: 'TOKEN_REFRESH',
              payload: { accessToken: token },
            });
          }
        } catch (error) {
          get().clear();
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      getCurrentUser: async () => {
        set({ isLoading: true });
        try {
          const user = await getCurrentUserApi();
          get().setUser(user);
        } catch (error) {
          get().clear();
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          const token = get().accessToken;
          if (token) {
            await logoutApi();
          }
        } catch (error) {
          console.error('Logout API error:', error);
        } finally {
          get().clear();
          authChannel?.postMessage({ type: 'LOGOUT' });
        }
      },

      clear: () => {
        set({
          accessToken: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
          hasAttemptedRefresh: false,
        });
      },
    }),
    {
      name: 'auth',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

if (authChannel) {
  authChannel.onmessage = (event) => {
    const { type, payload } = event.data;
    switch (type) {
      case 'LOGIN':
        useAuthStore.setState({
          user: payload.user,
          accessToken: payload.accessToken,
          isAuthenticated: true,
        });
        break;
      case 'LOGOUT':
        useAuthStore.getState().clear();
        break;
      case 'TOKEN_REFRESH':
        useAuthStore.setState({
          accessToken: payload.accessToken,
        });
        break;
    }
  };
}
