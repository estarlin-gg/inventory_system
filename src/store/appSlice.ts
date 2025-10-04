import {  StateCreator } from "zustand";

export interface AppState {
  isLoading: boolean;
  setLoading: (l: boolean) => void;
}

export const useAppSlice :StateCreator<AppState> = ((set) => ({
  isLoading: true,
  setLoading(l: boolean) {
    set({ isLoading: l });
  },
  
}));

