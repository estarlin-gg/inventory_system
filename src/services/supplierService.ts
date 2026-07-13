import { supabase } from "../lib/supabase";
import { Supplier, SupplierCreate } from "../models/supplier";
import { Product } from "../models/product";

const getSuppliers = async (): Promise<Supplier[]> => {
  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .order("name");
  if (error) throw error;
  return data as Supplier[];
};

const getSupplier = async (id: number): Promise<Supplier> => {
  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .eq("supplier_id", id)
    .single();
  if (error) throw error;
  return data as Supplier;
};

const getSupplierProducts = async (id: number): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("supplier_id", id);
  if (error) throw error;
  return data as Product[];
};

const createSupplier = async (s: SupplierCreate): Promise<Supplier> => {
  const { data, error } = await supabase
    .from("suppliers")
    .insert(s)
    .select()
    .single();
  if (error) throw error;
  return data as Supplier;
};

const updateSupplier = async (
  id: number,
  s: Partial<SupplierCreate>
): Promise<Supplier> => {
  const { data, error } = await supabase
    .from("suppliers")
    .update(s)
    .eq("supplier_id", id)
    .select()
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("Proveedor no encontrado");
  return data as Supplier;
};

const deleteSupplier = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from("suppliers")
    .delete()
    .eq("supplier_id", id);
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
