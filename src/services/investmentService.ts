import { supabase } from "../lib/supabase";
import { Investment, InvestmentCreate } from "../models/investment";

const getCurrentUserId = async (): Promise<string> => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("No hay usuario autenticado");
  return user.id;
};

const getInvestmentsBySupplier = async (supplierId: number): Promise<Investment[]> => {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from("investments")
    .select("*, products(product_name)")
    .eq("supplier_id", supplierId)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row: Record<string, unknown>) => ({
    ...row,
    product_name: (row.products as { product_name: string } | null)?.product_name ?? "",
  })) as Investment[];
};

const getAllInvestments = async (): Promise<Investment[]> => {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from("investments")
    .select("*, products(product_name)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row: Record<string, unknown>) => ({
    ...row,
    product_name: (row.products as { product_name: string } | null)?.product_name ?? "",
  })) as Investment[];
};

const createInvestment = async (inv: InvestmentCreate): Promise<Investment> => {
  const userId = await getCurrentUserId();

  const { data: investData, error: investError } = await supabase
    .from("investments")
    .insert({ ...inv, user_id: userId })
    .select("*, products(product_name)")
    .single();
  if (investError) throw investError;

  const { data: psRow } = await supabase
    .from("product_suppliers")
    .select("stock")
    .eq("product_id", inv.product_id)
    .eq("supplier_id", inv.supplier_id)
    .single();

  const currentSupplierStock = psRow?.stock ?? 0;
  const { error: stockError } = await supabase
    .from("product_suppliers")
    .update({ stock: currentSupplierStock + inv.quantity })
    .eq("product_id", inv.product_id)
    .eq("supplier_id", inv.supplier_id);
  if (stockError) throw stockError;

  return {
    ...investData,
    product_name: (investData.products as { product_name: string } | null)?.product_name ?? "",
  } as unknown as Investment;
};

const deleteInvestment = async (id: number): Promise<void> => {
  const userId = await getCurrentUserId();

  const { data: inv, error: fetchError } = await supabase
    .from("investments")
    .select("product_id, quantity, supplier_id")
    .eq("id", id)
    .eq("user_id", userId)
    .single();
  if (fetchError) throw fetchError;

  const { error } = await supabase
    .from("investments")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);
  if (error) throw error;

  if (inv) {
    const { data: psRow } = await supabase
      .from("product_suppliers")
      .select("stock")
      .eq("product_id", inv.product_id)
      .eq("supplier_id", inv.supplier_id)
      .single();

    const currentSupplierStock = psRow?.stock ?? 0;
    const newStock = Math.max(0, currentSupplierStock - inv.quantity);
    await supabase
      .from("product_suppliers")
      .update({ stock: newStock })
      .eq("product_id", inv.product_id)
      .eq("supplier_id", inv.supplier_id);
  }
};

export const investmentService = {
  getInvestmentsBySupplier,
  getAllInvestments,
  createInvestment,
  deleteInvestment,
};
