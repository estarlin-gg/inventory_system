import { Sale } from "../models/sale";
import { supabase } from "../lib/supabase";

const getSales = async (): Promise<Sale[]> => {
  // const { data, error } = await supabase.from("sales").select("*");
 const { data, error } = await supabase
  .from("sales")
  .select(`
    *,
    sale_products!SaleProducts_sale_id_fkey (*)
  `);
  if (error) throw error;
  return data as Sale[];
};

const getSalesToday = async (): Promise<Sale[]> => {
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("sales")
    .select("*")
    .gte("created_at", `${today}T00:00:00`)
    .lte("created_at", `${today}T23:59:59`);

  if (error) throw error;
  return data as Sale[];
};

const createSale = async (sale: Sale): Promise<Sale> => {
  const productsJson = sale.sale_products.map((p) => ({
    product_id: p.product_id,
    product_name: p.product_name, 
    price: p.price,
    quantity: p.quantity,
  }));

  const { data, error } = await supabase.rpc("create_sale_transaction", {
    customer_name: sale.customer_name,
    total_pay: sale.total_pay,
    products: productsJson, 
  });

  if (error) throw error;

  return {
    ...data.sale, 
    sales_products: data.products, 
  } as Sale;
};


export const saleService = {
  getSales,
  createSale,
  getSalesToday,
};
// mi modelo tiene sale_id, product_id, product_name, quantity y price 