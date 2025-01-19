import { StateCreator } from "zustand";
import { IOrderItem } from "../model";
import { generateInvoicePDF } from "../utils/pdfUtils";
import { uploadPDF } from "../services/fileServices";
import { addInvoice } from "../services/invoiceService";
import { updateStocks } from "../services/productService";
import { productSlice, ProductState } from "./productSlice";
import { ChangeEvent } from "react";

export interface ShoppingListStore {
  shoppingList: IOrderItem[];
  deleteItem: (id: string) => void;
  addItem: (product: IOrderItem) => void;
  payShoppingList: () => Promise<void>;
  client: string;
  handleClient: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const shoppingListSlice: StateCreator<
  ShoppingListStore & ProductState
> = (set, get, api) => ({
  ...productSlice(set, get, api),
  shoppingList: [],
  client: "",
  handleClient: (e) => {
    set(() => ({ client: e.target.value }));
  },
  deleteItem: (id: string) => {
    set((state) => ({
      shoppingList: state.shoppingList.filter((item) => item.id !== id),
    }));
  },
  addItem: (product) => {
    const isExist = get().shoppingList.find((p) => p.id === product.id);

    if (!isExist) {
      set((state) => ({
        shoppingList: [...state.shoppingList, product],
      }));
    } else {
      const updatedList = get().shoppingList.map((p) =>
        p.id === product.id ? { ...p, quantity: product.quantity } : p
      );
      set({ shoppingList: updatedList });
    }
  },
  payShoppingList: async () => {
    const shoppingList = get().shoppingList;
    const totalPay = shoppingList.reduce(
      (a, i) => a + i.price * (i.quantity || 1),
      0
    );

    try {
      const pdfFile = await generateInvoicePDF(shoppingList, totalPay, "sweet");
      const invoiceUrl = await uploadPDF("user_id", pdfFile);

      const invoice = {
        items: shoppingList.map((item) => ({
          ...item,
          quantity: item.quantity || 1,
        })),
        invoice_url: invoiceUrl,
        total: totalPay,
        client: get().client,
        invoice_id: pdfFile.name,
      };

      await addInvoice(invoice);

      await updateStocks(shoppingList);
    } catch (error) {
      console.error("Error al procesar el pago:", error);
    }
  },
});
