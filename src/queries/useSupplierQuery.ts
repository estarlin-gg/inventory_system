import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supplierService } from "../services/supplierService";
import { SupplierCreate } from "../models/supplier";
import { offlineService } from "../services/offline";
import { isElectron } from "../utils/platform";

export const useSupplierQuery = () => {
  const queryClient = useQueryClient();

  const suppliersQuery = useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      if (isElectron) {
        try {
          const data = await supplierService.getSuppliers();
          offlineService.suppliers.save(data).catch(() => {});
          return data;
        } catch {
          return offlineService.suppliers.get();
        }
      }
      return supplierService.getSuppliers();
    },
    staleTime: isElectron ? 1000 * 60 * 60 : 0,
  });

  const createSupplierMutation = useMutation({
    mutationFn: async (s: SupplierCreate) => {
      if (isElectron) {
        const local = await offlineService.suppliers.create(s);
        try {
          await supplierService.createSupplier(s);
        } catch {
          // syncService will retry later
        }
        return local;
      }
      return supplierService.createSupplier(s);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      await queryClient.refetchQueries({ queryKey: ["suppliers"] });
    },
  });

  const updateSupplierMutation = useMutation({
    mutationFn: async ({ id, s }: { id: number; s: Partial<SupplierCreate> }) => {
      if (isElectron) {
        const local = await offlineService.suppliers.update(id, s);
        try {
          await supplierService.updateSupplier(id, s);
        } catch {
          // syncService will retry later
        }
        return local;
      }
      return supplierService.updateSupplier(id, s);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      await queryClient.refetchQueries({ queryKey: ["suppliers"] });
    },
  });

  const deleteSupplierMutation = useMutation({
    mutationFn: async (id: number) => {
      if (isElectron) {
        await offlineService.suppliers.remove(id);
        try {
          await supplierService.deleteSupplier(id);
        } catch {
          // syncService will retry later
        }
        return;
      }
      return supplierService.deleteSupplier(id);
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
