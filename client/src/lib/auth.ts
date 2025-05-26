export interface User {
  id: number;
  name: string;
  email: string;
  preferences?: string[];
}

export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
}

export const AUTH_STORAGE_KEY = 'newsHub_auth';

export function saveAuthState(user: User): void {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

export function loadAuthState(): User | null {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function clearAuthState(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}
