import { API_ENDPOINTS } from '@/lib/constants';
import axios, { type InternalAxiosRequestConfig } from 'axios';

interface ExtendedRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: 'application/json',
  },
  withCredentials: true,
  timeout: 10000,
});

let authStore: typeof import('@/store/auth').useAuthStore | null = null;
const getAuthStore = async () => {
  if (!authStore) {
    const mod = await import('@/store/auth');
    authStore = mod.useAuthStore;
  }
  return authStore;
};

apiClient.interceptors.request.use(async (config: ExtendedRequestConfig) => {
  const store = await getAuthStore();
  const token = store.getState().accessToken;
  if (token && !config._retry && !config.url?.includes(API_ENDPOINTS.auth.refresh)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as ExtendedRequestConfig;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes(API_ENDPOINTS.auth.refresh) &&
      !originalRequest.url?.includes(API_ENDPOINTS.auth.login)
    ) {
      const store = await getAuthStore();

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            originalRequest._retry = true;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await apiClient.post<{ access_token?: string }>(
          API_ENDPOINTS.auth.refresh,
        );

        if (refreshResponse.status === 204 || !refreshResponse.data?.access_token) {
          store.getState().clear();
          processQueue(new Error('Session expired'), null);
          return Promise.reject(error);
        }

        const newAccessToken = refreshResponse.data.access_token;
        store.getState().setToken(newAccessToken);

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        store.getState().clear();
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
