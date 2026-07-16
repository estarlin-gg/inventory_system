import { supabase } from "../lib/supabase";
import { Product, ProductCreate } from "../models/product";

const getCurrentUserId = async (): Promise<string> => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("No hay usuario autenticado");
  return user.id;
};

const getProducts = async (): Promise<Product[]> => {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("user_id", userId);
  if (error) throw error;
  return (data ?? []) as Product[];
};

const createProduct = async (p: ProductCreate): Promise<Product> => {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from("products")
    .insert({ ...p, user_id: userId })
    .select()
    .single();
  if (error) throw error;
  return data as Product;
};

const updateProduct = async (
  id: number,
  p: Partial<ProductCreate>
): Promise<Product> => {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from("products")
    .update(p)
    .eq("product_id", id)
    .eq("user_id", userId)
    .select()
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("Producto no encontrado");
  return data as Product;
};

const deleteProduct = async (id: number): Promise<void> => {
  const userId = await getCurrentUserId();
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("product_id", id)
    .eq("user_id", userId);
  if (error) throw error;
};

export const productService = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
