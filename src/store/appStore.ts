import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { productSlice, ProductState } from "./productSlice";
import { shoppingListSlice, ShoppingListStore } from "./shoppingListSlice";
import { IProduct } from "../model";
import { invoiceSlice, InvoiceState } from "./invoiceSlice";

export type AppState = ProductState &
  ShoppingListStore &
  InvoiceState & {
    modal: boolean;
    handleModal: () => void;
  };

export const useAppStore = create<AppState>()(
  devtools(
    (set, get, store) => ({
      ...invoiceSlice(set, get, store),
      ...productSlice(set, get, store),
      ...shoppingListSlice(set, get, store),
      modal: false,
      handleModal: () => {
        set((state) => ({
          modal: !state.modal,
        }));

        if (!get().modal) {
          set(() => ({
            selectedProduct: {} as IProduct,
          }));
        }
      },
    }),
    { name: "AppStore" }
  )
);
