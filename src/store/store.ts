import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { AuthState, useAuthSlice } from "./authSlice";
import { AppState, useAppSlice } from "./appSlice";
import { ProductState, useProductSlice } from "./productSlice";
import { SaleState, useSaleSlice } from "./saleSlice";
import { AnalyticState, useAnalyticSlice } from "./analyticStore";

type StoreApp = AuthState & AppState & ProductState & SaleState & AnalyticState;

export const useStore = create<StoreApp>()(
  devtools(
    (set, get, api) => ({
      ...useAuthSlice(set, get, api),
      ...useAppSlice(set, get, api),
      ...useProductSlice(set, get, api),
      ...useSaleSlice(set, get, api),
      ...useAnalyticSlice(set, get, api),
    }),
    {
      name: "MyAppStore",
    }
  )
);
