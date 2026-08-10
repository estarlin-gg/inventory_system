import { StateCreator } from "zustand";

import { User } from "@supabase/supabase-js";

export interface AuthState {
  authResponse: User | null;
  authChecked: boolean;
  setAuthResponse: (a: User | null) => void;
  setAuthChecked: (v: boolean) => void;
  error: string | null;
}

export const useAuthSlice: StateCreator<AuthState> = (set) => ({
  authResponse: null,
  authChecked: false,
  error: null,

  setAuthResponse: (a) => set({ authResponse: a }),
  setAuthChecked: (v) => set({ authChecked: v }),
});
