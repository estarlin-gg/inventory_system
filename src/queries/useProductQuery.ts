import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "../services/productService";
import { useStore } from "../store/store";
import { useEffect } from "react";
import { ProductCreate } from "../models/product";
import { offlineService } from "../services/offline";
import { isElectron } from "../utils/platform";

export const useProductQuery = () => {
  const setProducts = useStore((s) => s.setProducts);
  const queryClient = useQueryClient();

  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      if (isElectron) {
        try {
          const data = await productService.getProducts();
          offlineService.products.save(data).catch(() => {});
          return data;
        } catch {
          return offlineService.products.get();
        }
      }
      return productService.getProducts();
    },
    staleTime: isElectron ? 1000 * 60 * 60 : 0,
  });

  useEffect(() => {
    if (productsQuery.data) {
      setProducts(productsQuery.data);
    }
  }, [productsQuery.data, setProducts]);

  const createProductMutation = useMutation({
    mutationFn: async (p: ProductCreate) => {
      if (isElectron) {
        const local = await offlineService.products.create(p);
        try {
          await productService.createProduct(p);
        } catch {
          // syncService will retry later
        }
        return local;
      }
      return productService.createProduct(p);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await queryClient.refetchQueries({ queryKey: ["products"] });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, p }: { id: number; p: Partial<ProductCreate> }) => {
      if (isElectron) {
        const local = await offlineService.products.update(id, p);
        try {
          await productService.updateProduct(id, p);
        } catch {
          // syncService will retry later
        }
        return local;
      }
      return productService.updateProduct(id, p);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await queryClient.refetchQueries({ queryKey: ["products"] });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      if (isElectron) {
        await offlineService.products.remove(id);
        try {
          await productService.deleteProduct(id);
        } catch {
          // syncService will retry later
        }
        return;
      }
      return productService.deleteProduct(id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await queryClient.refetchQueries({ queryKey: ["products"] });
    },
  });

  return {
    productsQuery,
    createProductMutation,
    updateProductMutation,
    deleteProductMutation,
  };
};
