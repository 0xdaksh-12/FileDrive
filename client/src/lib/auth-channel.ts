import type { User } from '@/api/account.api';

export type AuthEvent =
  | { type: 'LOGIN'; payload: { user: User; accessToken: string } }
  | { type: 'LOGOUT' }
  | { type: 'TOKEN_REFRESH'; payload: { accessToken: string } };

export const authChannel =
  typeof window !== 'undefined' ? new BroadcastChannel('auth') : null;
