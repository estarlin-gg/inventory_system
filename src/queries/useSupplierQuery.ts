import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supplierService } from "../services/supplierService";
import { SupplierCreate } from "../models/supplier";

export const useSupplierQuery = () => {
  const queryClient = useQueryClient();

  const suppliersQuery = useQuery({
    queryKey: ["suppliers"],
    queryFn: supplierService.getSuppliers,
    staleTime: 1000 * 60 * 60,
  });

  const createSupplierMutation = useMutation({
    mutationFn: (s: SupplierCreate) => supplierService.createSupplier(s),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });

  const updateSupplierMutation = useMutation({
    mutationFn: ({ id, s }: { id: number; s: Partial<SupplierCreate> }) =>
      supplierService.updateSupplier(id, s),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });

  const deleteSupplierMutation = useMutation({
    mutationFn: (id: number) => supplierService.deleteSupplier(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });

  return {
    suppliersQuery,
    createSupplierMutation,
    updateSupplierMutation,
    deleteSupplierMutation,
  };
};
