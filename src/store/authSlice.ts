/* eslint-disable @typescript-eslint/no-explicit-any */
import { StateCreator } from "zustand";
import { Credentials, LoginCredentials } from "../models/auth";
import { login, register } from "../services/authService";
import { AppState, useAppSlice } from "./appSlice";
import { User } from "@supabase/supabase-js";

export interface AuthState {
  authResponse: User | null;
  setAuthResponse: (a: User | null) => void;
  error: string | null;
  login: (c: LoginCredentials) => Promise<void>;
  register: (c: Credentials) => Promise<void>;
  logout: () => void;
}

export const useAuthSlice: StateCreator<AuthState & AppState > = (
  set,
  get,
  api
) => ({
  ...useAppSlice(set, get, api),
  authResponse: null,
  error: null,

  login: async (c) => {
    const setLoading = get().setLoading;
    setLoading(true);
    try {
      const { user } = await login(c);

      set({ authResponse: user });
    } catch (err: any) {
      set({ error: err.message || "Error al iniciar sesión" });
    } finally {
      setLoading(false);
    }
  },

  register: async (c) => {
    const setLoading = get().setLoading;
    setLoading(true);
    try {
      const { data } = await register(c);

      set({ authResponse: data.user });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Error al registrarse" });
    } finally {
      setLoading(false);
    }
  },

  setAuthResponse: (a) => set({ authResponse: a, isLoading: false }),

  logout: () => {
    set({ authResponse: null });
  },
});
