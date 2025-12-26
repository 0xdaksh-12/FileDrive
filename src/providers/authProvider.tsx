import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  ApiResponse,
  AuthPayload,
  User,
  LoginRequest,
  RegisterRequest,
  AuthContextType,
} from '@/types';
import {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import AuthContext from '@/context/authContext';
import { api, apiAuth } from '@/lib/api';

interface Props {
  children: React.ReactNode;
}

interface ExtendedRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export default function AuthProvider({ children }: Props) {
  const [token, setToken] = useState<string | null>(
    () => sessionStorage.getItem('Token') || null
  );
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Persist token to sessionStorage
  useEffect(() => {
    if (token) {
      sessionStorage.setItem('Token', token);
    } else {
      sessionStorage.removeItem('Token');
    }
  }, [token]);

  // 1. Initialize: Try to refresh token on mount
  useEffect(() => {
    let isMounted = true;

    const initializeToken = async (): Promise<void> => {
      if (token) {
        setLoading(false);
        return;
      }

      try {
        const response = await apiAuth.post<ApiResponse<AuthPayload>>(
          '/auth/refresh',
          {}
        );

        if (!isMounted) return;

        if (response.status === 204) {
          setToken(null);
        } else {
          setToken(response.data.data.accessToken);
        }
      } catch {
        if (isMounted) setToken(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initializeToken();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. Interceptor: Add Token to Requests
  const interceptorReadyRef = useRef<boolean>(false);

  useEffect(() => {
    const requestInterceptor = apiAuth.interceptors.request.use(
      (config: ExtendedRequestConfig): ExtendedRequestConfig => {
        if (!config._retry && token) {
          config.headers = config.headers ?? {};
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    interceptorReadyRef.current = true;
    return () => {
      apiAuth.interceptors.request.eject(requestInterceptor);
      interceptorReadyRef.current = false;
    };
  }, [token]);

  // 3. Fetch User Profile
  const fetchCurrentUser = useCallback(async (): Promise<void> => {
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const response = await apiAuth.get<ApiResponse<User>>('/users/me');
      setUser(response.data.data);
    } catch (error) {
      console.error('Failed to fetch user', error);
      setToken(null);
      setUser(null);
    }
  }, [token]);

  // Fetch user when token changes
  useEffect(() => {
    if (token) fetchCurrentUser();
  }, [token, fetchCurrentUser]);

  // 4. Response Interceptor: Auto-Refresh on 401
  useEffect(() => {
    const responseInterceptor = apiAuth.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as ExtendedRequestConfig;

        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !originalRequest.url?.includes('/refresh') &&
          !originalRequest.url?.includes('/login')
        ) {
          originalRequest._retry = true;

          try {
            const refreshResponse = await apiAuth.post<
              ApiResponse<AuthPayload>
            >('/auth/refresh', {}, { withCredentials: true });

            const newToken = refreshResponse.data.data.accessToken;
            setToken(newToken);

            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = `Bearer ${newToken}`;

            return apiAuth(originalRequest);
          } catch (refreshError) {
            setToken(null);
            setUser(null);
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      apiAuth.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  // Login
  const login = useCallback(
    async (credentials: LoginRequest): Promise<AuthPayload> => {
      setLoading(true);
      try {
        const response = await api.post<ApiResponse<AuthPayload>>(
          '/auth/login',
          credentials
        );

        const payload = response.data.data;
        setToken(payload.accessToken);
        return payload;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Register
  const register = useCallback(
    async (data: RegisterRequest): Promise<AuthPayload> => {
      setLoading(true);
      try {
        const response = await api.post<ApiResponse<AuthPayload>>(
          '/auth/register',
          data
        );

        const payload = response.data.data;
        setToken(payload.accessToken);
        return payload;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Logout
  const logout = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      await apiAuth.post('/auth/logout', {}, { withCredentials: true });
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      setToken(null);
      setUser(null);
      setLoading(false);
      sessionStorage.removeItem('Token');
    }
  }, []);

  const value: AuthContextType = {
    user,
    isAuth: !!user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
