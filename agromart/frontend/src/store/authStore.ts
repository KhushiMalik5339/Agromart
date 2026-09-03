import { create } from 'zustand';
import { User } from '../types';

interface AuthStore {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string, refreshToken: string) => void;
  setTokens: (token: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

const savedToken = localStorage.getItem('agromart_token');
const savedRefreshToken = localStorage.getItem('agromart_refresh_token');
const savedUser = localStorage.getItem('agromart_user');

export const useAuthStore = create<AuthStore>((set) => ({
  user: savedUser ? JSON.parse(savedUser) : null,
  token: savedToken || null,
  refreshToken: savedRefreshToken || null,
  isAuthenticated: !!savedToken,
  setAuth: (user, token, refreshToken) => {
    localStorage.setItem('agromart_token', token);
    localStorage.setItem('agromart_refresh_token', refreshToken);
    localStorage.setItem('agromart_user', JSON.stringify(user));
    set({ user, token, refreshToken, isAuthenticated: true });
  },
  setTokens: (token, refreshToken) => {
    localStorage.setItem('agromart_token', token);
    localStorage.setItem('agromart_refresh_token', refreshToken);
    set({ token, refreshToken, isAuthenticated: true });
  },
  setUser: (user) => {
    localStorage.setItem('agromart_user', JSON.stringify(user));
    set({ user });
  },
  logout: () => {
    localStorage.removeItem('agromart_token');
    localStorage.removeItem('agromart_refresh_token');
    localStorage.removeItem('agromart_user');
    set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
  },
}));
