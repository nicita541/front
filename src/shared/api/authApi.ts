import { endpoints } from './endpoints';
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
  const { data } = await http.post<AuthResponse>(endpoints.auth.login, payload);
  saveAuthTokens(data.accessToken, data.refreshToken);
  return data;
}

export async function register(payload: RegisterRequest) {
  const { data } = await http.post<AuthResponse>(endpoints.auth.register, payload);
  saveAuthTokens(data.accessToken, data.refreshToken);
  return data;
}

export async function getMe() {
  const { data } = await http.get<Account>(endpoints.auth.me);
  return data;
}
