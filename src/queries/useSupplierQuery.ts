import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supplierService } from "../services/supplierService";
import { SupplierCreate } from "../models/supplier";
import { offlineService, networkService } from "../services/offline";

export const useSupplierQuery = () => {
  const queryClient = useQueryClient();

  const suppliersQuery = useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      if (networkService.isOnline) {
        const data = await supplierService.getSuppliers();
        offlineService.suppliers.save(data);
        return data;
      }
      return offlineService.suppliers.get();
    },
    staleTime: 1000 * 60 * 60,
  });

  const createSupplierMutation = useMutation({
    mutationFn: async (s: SupplierCreate) => {
      if (networkService.isOnline) {
        return supplierService.createSupplier(s);
      }
      return offlineService.suppliers.create(s);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      await queryClient.refetchQueries({ queryKey: ["suppliers"] });
    },
  });

  const updateSupplierMutation = useMutation({
    mutationFn: async ({ id, s }: { id: number; s: Partial<SupplierCreate> }) => {
      if (networkService.isOnline) {
        return supplierService.updateSupplier(id, s);
      }
      return offlineService.suppliers.update(id, s);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      await queryClient.refetchQueries({ queryKey: ["suppliers"] });
    },
  });

  const deleteSupplierMutation = useMutation({
    mutationFn: async (id: number) => {
      if (networkService.isOnline) {
        return supplierService.deleteSupplier(id);
      }
      return offlineService.suppliers.remove(id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      await queryClient.refetchQueries({ queryKey: ["suppliers"] });
    },
  });

  return {
    suppliersQuery,
    createSupplierMutation,
    updateSupplierMutation,
    deleteSupplierMutation,
  };
};

export const useSupplierProductsQuery = (supplierId: number) => {
  const supplierProductsQuery = useQuery({
    queryKey: ["supplierProducts", supplierId],
    queryFn: () => supplierService.getSupplierProducts(supplierId),
    staleTime: 1000 * 60 * 30,
  });

  return { supplierProductsQuery };
};
