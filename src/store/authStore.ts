import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ─── Tipos ───────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  username: string;
  isAdmin: boolean;
  createdAt?: string;
}

interface AuthState {
  user: AuthUser | null;
  setUser: (user: AuthUser) => void;
  clearUser: () => void;
  isAuthenticated: () => boolean;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,

      setUser: (user: AuthUser) => set({ user }),

      clearUser: () => set({ user: null }),

      isAuthenticated: () => get().user !== null,
    }),
    {
      name: 'magugi-auth',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
