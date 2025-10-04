import { StateCreator } from "zustand";
import { Sale, SalesProduct } from "../models/sale";
import { ProductState, useProductSlice } from "./productSlice";

export interface SaleState {
  isShoppingListopen: boolean;
  saleDetail: Sale;
  saleDetailModal: boolean;
  setDetailModal: () => void;
  setSaleDetail: (s: Sale) => void;
  setSales: (s: Sale[]) => void;
  updateSaleDetail: (partial: Partial<Sale>) => void;
  handleShoppingList: () => void;
  sales: Sale[];
  salesToday: Sale[];
  sale: Sale;
  shoppingList: SalesProduct[];
  addShoppinList: (p: SalesProduct) => void;
  removeProduct: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  customerName: string;
  handleCustomer: (c: string) => void;
}

export const useSaleSlice: StateCreator<SaleState & ProductState> = (
  set,
  get,
  api
) => ({
  ...useProductSlice(set, get, api),

  isShoppingListopen: false,
  saleDetailModal: false,
  saleDetail: {
    id: 0,
    customer_name: "",
    total_pay: 0,
    created_at: new Date(),
    sale_products: [],
  },
  sales: [],
  salesToday: [],
  sale: {} as Sale,
  customerName: "Cliente Desconocido",
  shoppingList: [],

  setSaleDetail: (s) => set({ saleDetail: s, saleDetailModal: true }),
  setSales: (s) => set({ sales: s }),

  updateSaleDetail: (partial) =>
    set((s) => ({
      saleDetail: {
        ...s.saleDetail,
        ...partial,
      },
    })),

  handleCustomer: (c) => {
    set({ customerName: c });
    get().updateSaleDetail({ customer_name: c });
  },

  handleShoppingList: () =>
    set((state) => ({ isShoppingListopen: !state.isShoppingListopen })),

  setDetailModal: () =>
    set((state) => ({ saleDetailModal: !state.saleDetailModal })),

  addShoppinList: (pr) => {
    const currentList = get().shoppingList;
    const exists = currentList.find((p) => p.product_id === pr.product_id);
    let newList: SalesProduct[];

    if (exists) {
      newList = currentList.map((p) =>
        p.product_id === pr.product_id
          ? {
              ...p,
              quantity: p.quantity + 1,
              final_price: (p.quantity + 1) * p.price,
            }
          : p
      );
    } else {
      newList = [
        ...get().shoppingList,
        { ...pr, quantity: 1, final_price: pr.price },
      ];
    }

    const totalPay = newList.reduce((acc, obj) => acc + obj.final_price, 0);

    set({
      shoppingList: newList,
      saleDetail: {
        ...get().saleDetail,
        sale_products: newList,
        total_pay: totalPay,
      },
    });
  },

  decreaseQuantity: (id: number) => {
    const currentList = get().shoppingList;
    const updatedList = currentList
      .map((p) => {
        if (p.product_id === id) {
          const newQuantity = p.quantity - 1;
          if (newQuantity <= 0) return null;
          return {
            ...p,
            quantity: newQuantity,
            final_price: newQuantity * p.price,
          };
        }
        return p;
      })
      .filter((p) => p !== null) as SalesProduct[];

    const totalPay = updatedList.reduce((acc, obj) => acc + obj.final_price, 0);

    set({
      shoppingList: updatedList,
      saleDetail: {
        ...get().saleDetail,
        sale_products: updatedList,
        total_pay: totalPay,
      },
    });
  },

  removeProduct: (id) => {
    const list = get().shoppingList.filter((p) => p.product_id !== id);
    const totalPay = list.reduce((acc, obj) => acc + obj.final_price, 0);

    set({
      shoppingList: list,
      saleDetail: {
        ...get().saleDetail,
        sale_products: list,
        total_pay: totalPay,
      },
    });
  },
});
