import { supabase } from "../lib/supabase";
import { Product, ProductCreate } from "../models/product";

const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase.from("products").select("*");
  if (error) throw error;
  return data as Product[]; 
};

const createProduct = async (p: ProductCreate): Promise<Product> => {
  const { data, error } = await supabase
    .from("products")
    .insert(p)
    .select()
    .single();
  if (error) throw error;
  return data as Product;
};

const updateProduct = async (
  id: number,
  p: Partial<ProductCreate>
): Promise<Product> => {
  const { data, error } = await supabase
    .from("products")
    .update(p)
    .eq("product_id", id)
    .select()
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("Producto no encontrado"); 
  return data as Product;
};

const deleteProduct = async (id: number): Promise<void> => {
  const { error } = await supabase.from("products").delete().eq("product_id", id);
  if (error) throw error;
};

export const productService = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
