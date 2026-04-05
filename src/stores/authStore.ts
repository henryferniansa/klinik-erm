import { create } from "zustand";
import type { User } from "../types";

const isDemoMode = import.meta.env.VITE_DEMO_MODE === "true";

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: isDemoMode
    ? { id: 1, name: "Admin Demo", email: "admin@demo.com", role: "admin" }
    : null,
  token: isDemoMode ? "demo-token" : localStorage.getItem("token"),
  setAuth: (user, token) => {
    localStorage.setItem("token", token);
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },
}));
