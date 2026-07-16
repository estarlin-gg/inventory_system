import { Sale } from "../models/sale";
import { supabase } from "../lib/supabase";

const getCurrentUserId = async (): Promise<string> => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("No hay usuario autenticado");
  return user.id;
};

const normalizeSale = (sale: Record<string, unknown>): Sale => {
  const sale_products = (sale.sale_products ?? sale.sales_products ?? []) as Sale["sale_products"];
  return {
    ...sale,
    id: sale.id ?? sale.sale_id,
    sale_products,
  } as unknown as Sale;
};

const getSales = async (): Promise<Sale[]> => {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from("sales")
    .select(`
      *,
      sale_products!SaleProducts_sale_id_fkey (*)
    `)
    .eq("user_id", userId);
  if (error) throw error;
  return (data ?? []).map(normalizeSale);
};

const getSalesToday = async (): Promise<Sale[]> => {
  const userId = await getCurrentUserId();
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("sales")
    .select("*")
    .eq("user_id", userId)
    .gte("created_at", `${today}T00:00:00`)
    .lte("created_at", `${today}T23:59:59`);

  if (error) throw error;
  return (data ?? []).map(normalizeSale);
};

const createSale = async (sale: Sale): Promise<Sale> => {
  const productsJson = sale.sale_products.map((p) => ({
    product_id: p.product_id,
    product_name: p.product_name, 
    price: p.price,
    cost: p.cost ?? 0,
    quantity: p.quantity,
  }));

  const { data, error } = await supabase.rpc("create_sale_transaction", {
    customer_name: sale.customer_name,
    total_pay: sale.total_pay,
    products: productsJson, 
  });

  if (error) throw error;

  return normalizeSale({ ...data.sale, sale_products: data.products });
};


export const saleService = {
  getSales,
  createSale,
  getSalesToday,
};
