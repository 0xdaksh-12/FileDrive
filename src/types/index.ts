// types.ts

// 1. Standard API Response Wrapper (Matches backend 'ApiResponse<T>')
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// 2. The actual payload inside the wrapper for Auth endpoints
export interface AuthPayload {
  accessToken: string;
  // refreshToken is handled via httpOnly cookies, so we don't need it here
}

// 3. User shape returned by user-service 'getProfile'
export interface User {
  name: string;
  email: string;
  profilePic?: string;
}

// 4. Request payloads
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

// 5. Context Type
export interface AuthContextType {
  user: User | null;
  isAuth: boolean;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<AuthPayload>;
  register: (data: RegisterRequest) => Promise<AuthPayload>;
  logout: () => Promise<void>;
}
