import { StateCreator } from "zustand";
import { IInvoice } from "../model";
import { getInvoices } from "../services/invoiceService";

export interface InvoiceState {
  invoices: IInvoice[];
  getInvoices: (uid: string) => Promise<void>;
}

export const invoiceSlice: StateCreator<InvoiceState> = (set) => ({
  invoices: [],
  getInvoices: async (uid) => {
    const res = await getInvoices(uid);

    set(() => ({
      invoices: res,
    }));
  },
});
