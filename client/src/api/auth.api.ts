import { API_ENDPOINTS } from '@/lib/constants';
import { apiClient } from './client';

export interface LoginCrediental {
  email: string;
  password: string;
}

export interface RegisterCrediental extends LoginCrediental {
  name: string;
}

export interface BackendAuthResponse {
  access_token: string;
  token_type?: string;
}

export interface AuthResponse {
  accessToken: string;
}

export async function loginApi(crediental: LoginCrediental): Promise<AuthResponse> {
  const response = await apiClient.post<BackendAuthResponse>(
    API_ENDPOINTS.auth.login,
    crediental,
  );

  return {
    accessToken: response.data.access_token,
  };
}

export async function registerApi(crediental: RegisterCrediental): Promise<AuthResponse> {
  const response = await apiClient.post<BackendAuthResponse>(
    API_ENDPOINTS.auth.register,
    crediental,
  );

  return {
    accessToken: response.data.access_token,
  };
}

export async function logoutApi() {
  const response = await apiClient.post(API_ENDPOINTS.auth.logout);
  return response;
}

export async function newAccessTokenApi(): Promise<AuthResponse> {
  const response = await apiClient.post<BackendAuthResponse>(
    API_ENDPOINTS.auth.refresh,
  );

  return {
    accessToken: response.data.access_token,
  };
}
