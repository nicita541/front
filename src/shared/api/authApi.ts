import { http, saveAuthTokens } from './http';
import type { Account, AuthResponse } from './authTypes';

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = LoginRequest & {
  username: string;
  displayName?: string;
};

export async function login(payload: LoginRequest) {
  const { data } = await http.post<AuthResponse>('/api/auth/login', payload);
  saveAuthTokens(data.accessToken, data.refreshToken);
  return data;
}

export async function register(payload: RegisterRequest) {
  const { data } = await http.post<AuthResponse>('/api/auth/register', payload);
  saveAuthTokens(data.accessToken, data.refreshToken);
  return data;
}

export async function getMe() {
  const { data } = await http.get<Account>('/api/auth/me');
  return data;
}
