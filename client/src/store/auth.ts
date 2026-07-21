import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { apiClient } from '@/api/client';
import { API_ENDPOINTS } from '@/lib/constants';
import {
  loginApi,
  registerApi,
  logoutApi,
  newAccessTokenApi,
  type LoginCrediental,
  type RegisterCrediental,
} from '@/api/auth.api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setToken: (accessToken: string | null) => void;
  setUser: (user: User | null) => void;
  login: (credential: LoginCrediental) => Promise<void>;
  register: (credential: RegisterCrediental) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  clear: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,

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
          const response = await apiClient.get<User>(API_ENDPOINTS.user.user);
          get().setUser(response.data);
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
        }
      },

      clear: () => {
        set({
          accessToken: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
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
