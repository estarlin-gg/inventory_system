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

const getSupplierProducts = async (supplierId: number): Promise<Product[]> => {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from("product_suppliers")
    .select("stock, products(*)")
    .eq("supplier_id", supplierId);
  if (error) throw error;
  return ((data ?? []) as Record<string, unknown>[])
    .map((row) => {
      const product = row.products as Product;
      if (!product || product.user_id !== userId) return null;
      return { ...product, stock: row.stock as number };
    })
    .filter(Boolean) as Product[];
};

const getProductsBySupplier = async (supplierId: number): Promise<Product[]> => {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from("product_suppliers")
    .select("stock, products(*)")
    .eq("supplier_id", supplierId);
  if (error) throw error;
  return ((data ?? []) as Record<string, unknown>[])
    .map((row) => {
      const product = row.products as Product;
      if (!product || product.user_id !== userId) return null;
      return { ...product, stock: row.stock as number };
    })
    .filter(Boolean) as Product[];
};

const addProductToSupplier = async (productId: number, supplierId: number): Promise<void> => {
  const { error } = await supabase
    .from("product_suppliers")
    .insert({ product_id: productId, supplier_id: supplierId, stock: 0 });
  if (error) throw error;
};

const removeProductFromSupplier = async (productId: number, supplierId: number): Promise<void> => {
  const { error } = await supabase
    .from("product_suppliers")
    .delete()
    .eq("product_id", productId)
    .eq("supplier_id", supplierId);
  if (error) throw error;
};

const getProductSuppliers = async (productId: number): Promise<number[]> => {
  const { data, error } = await supabase
    .from("product_suppliers")
    .select("supplier_id")
    .eq("product_id", productId);
  if (error) throw error;
  return (data ?? []).map((r: { supplier_id: number }) => r.supplier_id);
};

const getAllProductSupplierPairs = async (): Promise<{ product_id: number; supplier_id: number }[]> => {
  const { data, error } = await supabase
    .from("product_suppliers")
    .select("product_id, supplier_id");
  if (error) throw error;
  return (data ?? []) as { product_id: number; supplier_id: number }[];
};

export const productService = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getSupplierProducts,
  getProductsBySupplier,
  addProductToSupplier,
  removeProductFromSupplier,
  getProductSuppliers,
  getAllProductSupplierPairs,
};
