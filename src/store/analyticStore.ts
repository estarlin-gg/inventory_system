import { StateCreator } from "zustand";
import { FullAnalyticsResponse } from "../models/analytic";
// import { getFullAnalytics } from "../services/analyticService";
// import { Sale } from "../models/sale";

export interface AnalyticState {
  fullAnalytics: FullAnalyticsResponse;
  // getFullAnalytic: () => Promise<void>;
  // salesToday: Sale[];
  // getSalesToday: () => Promise<void>;
}

export const useAnalyticSlice: StateCreator<AnalyticState> = () => ({
  fullAnalytics: {} as FullAnalyticsResponse,
  // salesToday: [],

  // getSalesToday: async () => {
  //   try {
  //     const res = await getSalesToday();
  //     set({ salesToday: res.data });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },
  // getFullAnalytic: async () => {
  //   const res = await getFullAnalytics();
  //    console.log(res.data)
  //   set({ fullAnalytics: res.data });
  // },
});
