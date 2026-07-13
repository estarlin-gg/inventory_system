import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "../services/productService";
import { useStore } from "../store/store";
import { useEffect } from "react";
import { ProductCreate } from "../models/product";
import { offlineService, networkService } from "../services/offline";

export const useProductQuery = () => {
  const setProducts = useStore((s) => s.setProducts);
  const queryClient = useQueryClient();

  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      if (networkService.isOnline) {
        const data = await productService.getProducts();
        offlineService.products.save(data);
        return data;
      }
      return offlineService.products.get();
    },
    staleTime: 1000 * 60 * 60,
  });

  useEffect(() => {
    if (productsQuery.data) {
      setProducts(productsQuery.data);
    }
  }, [productsQuery.data, setProducts]);

  const createProductMutation = useMutation({
    mutationFn: async (p: ProductCreate) => {
      if (networkService.isOnline) {
        return productService.createProduct(p);
      }
      return offlineService.products.create(p);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await queryClient.refetchQueries({ queryKey: ["products"] });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, p }: { id: number; p: Partial<ProductCreate> }) => {
      if (networkService.isOnline) {
        return productService.updateProduct(id, p);
      }
      return offlineService.products.update(id, p);
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await queryClient.refetchQueries({ queryKey: ["products"] });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      if (networkService.isOnline) {
        return productService.deleteProduct(id);
      }
      return offlineService.products.remove(id);
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
