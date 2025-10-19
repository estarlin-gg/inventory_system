import { StateCreator } from "zustand";

import { User } from "@supabase/supabase-js";

export interface AuthState {
  authResponse: User | null;
  setAuthResponse: (a: User | null) => void;
  error: string | null;
}

export const useAuthSlice: StateCreator<AuthState> = (set) => ({
  authResponse: null,
  error: null,

  setAuthResponse: (a) => set({ authResponse: a }),
});
