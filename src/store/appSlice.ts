import {  StateCreator } from "zustand";

export interface AppState {
  isLoading: boolean;
  setLoading: (l: boolean) => void;
}

export const useAppSlice :StateCreator<AppState> = ((set) => ({
  isLoading: false,
  setLoading(l: boolean) {
    set({ isLoading: l });
  },
  
}));

