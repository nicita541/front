export type Account = {
  id?: string;
  email: string;
  username?: string;
  displayName?: string;
  role?: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken?: string;
  account: Account;
};
