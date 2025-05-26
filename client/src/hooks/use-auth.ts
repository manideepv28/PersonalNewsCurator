import { create } from 'zustand';
import { User, saveAuthState, loadAuthState, clearAuthState } from '@/lib/auth';

interface AuthStore {
  user: User | null;
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  initialize: () => void;
}

export const useAuth = create<AuthStore>((set, get) => ({
  user: null,
  isLoggedIn: false,
  
  login: (user: User) => {
    saveAuthState(user);
    set({ user, isLoggedIn: true });
  },
  
  logout: () => {
    clearAuthState();
    set({ user: null, isLoggedIn: false });
  },
  
  updateUser: (updates: Partial<User>) => {
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      saveAuthState(updatedUser);
      set({ user: updatedUser });
    }
  },
  
  initialize: () => {
    const savedUser = loadAuthState();
    if (savedUser) {
      set({ user: savedUser, isLoggedIn: true });
    }
  },
}));
