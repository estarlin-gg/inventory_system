import { IInvoice } from "../model";
import { supabase } from "../supabase/supabase";

export const getInvoices = async (uid: string): Promise<IInvoice[]> => {
  try {
    const { data } = await supabase
      .from("invoices")
      .select("*")
      .eq("user_id", uid);

    const res = data?.map((i) => ({
      id: i.id,
      invoice_url: i.invoice_url,
      items: i.items,
      total: i.total,
      user_id: i.user_id,
      client: i.client,
      invoice_id: i.invoice_id,
    })) as IInvoice[];
    return res;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const addInvoice = async (i: IInvoice) => {
  try {
    const { data, error } = await supabase.from("invoices").insert([i]);
    if (error) {
      throw new Error(error.message);
    }
    console.log("Factura agregada:", data);
  } catch (error) {
    console.log("Error al guardar la factura:", error);
  }
};
