import { supabase } from "../lib/supabase";
import { Supplier, SupplierCreate } from "../models/supplier";
import { Product } from "../models/product";

const getCurrentUserId = async (): Promise<string> => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("No hay usuario autenticado");
  return user.id;
};

const getSuppliers = async (): Promise<Supplier[]> => {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .eq("user_id", userId)
    .order("name");
  if (error) throw error;
  return data as Supplier[];
};

const getSupplier = async (id: number): Promise<Supplier> => {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .eq("supplier_id", id)
    .eq("user_id", userId)
    .single();
  if (error) throw error;
  return data as Supplier;
};

const getSupplierProducts = async (id: number): Promise<Product[]> => {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("supplier_id", id)
    .eq("user_id", userId);
  if (error) throw error;
  return data as Product[];
};

const createSupplier = async (s: SupplierCreate): Promise<Supplier> => {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from("suppliers")
    .insert({ ...s, user_id: userId })
    .select()
    .single();
  if (error) throw error;
  return data as Supplier;
};

const updateSupplier = async (
  id: number,
  s: Partial<SupplierCreate>
): Promise<Supplier> => {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from("suppliers")
    .update(s)
    .eq("supplier_id", id)
    .eq("user_id", userId)
    .select()
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("Proveedor no encontrado");
  return data as Supplier;
};

const deleteSupplier = async (id: number): Promise<void> => {
  const userId = await getCurrentUserId();
  const { error } = await supabase
    .from("suppliers")
    .delete()
    .eq("supplier_id", id)
    .eq("user_id", userId);
  if (error) throw error;
};

export const supplierService = {
  getSuppliers,
  getSupplier,
  getSupplierProducts,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};
