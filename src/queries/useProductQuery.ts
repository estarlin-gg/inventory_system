import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "../services/productService";
import { useStore } from "../store/store";
import { useEffect } from "react";
import { ProductCreate } from "../models/product";

export const useProductQuery = () => {
  const setProducts = useStore((s) => s.setProducts);
  const queryClient = useQueryClient();

  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: productService.getProducts,
    staleTime: 1000 * 60 * 60,
  });

  useEffect(() => {
    if (productsQuery.data) {
      setProducts(productsQuery.data);
    }
  }, [productsQuery.data, setProducts]);

  const createProductMutation = useMutation({
    mutationFn: (p: ProductCreate) => productService.createProduct(p),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, p }: { id: number; p: Partial<ProductCreate> }) =>
      productService.updateProduct(id, p),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: number) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return {
    productsQuery,
    createProductMutation,
    updateProductMutation,
    deleteProductMutation,
  };
};
