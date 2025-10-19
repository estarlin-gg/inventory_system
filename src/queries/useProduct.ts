// hooks/useProducts.ts
import { useQuery, useMutation } from "@tanstack/react-query";
import { productService } from "../services/productService";
import { useStore } from "../store/store";
import Swal from "sweetalert2";
import { ProductCreate } from "../models/product";
import { queryClient } from "./queryClient";
import { useEffect } from "react";

export const useProducts = () => {
  const addProduct = useStore((s) => s.addProduct);
  const setProducts = useStore((s) => s.setProducts);
  const updateProduct = useStore((s) => s.updateProduct);
  const removeProduct = useStore((s) => s.removeProduct);

  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: productService.getProducts,
    staleTime: 1000 * 30 * 30,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (productsQuery.data) {
      setProducts(productsQuery.data);
    }
  }, [productsQuery.data, setProducts]);

  const createProductMutation = useMutation({
    mutationFn: productService.createProduct,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      addProduct(data);
      Swal.fire("Éxito", "Producto creado correctamente", "success");
    },
    onError: () => {
      Swal.fire("Error", "No se pudo crear el producto", "error");
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, p }: { id: number; p: ProductCreate }) =>
      productService.updateProduct(id, p),
    onSuccess: (data) => {
      updateProduct(data);
      queryClient.invalidateQueries({ queryKey: ["products"] });
      Swal.fire("Éxito", "Producto actualizado correctamente", "success");
    },
    onError: () => {
      Swal.fire("Error", "No se pudo actualizar el producto", "error");
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: productService.deleteProduct,
    onSuccess: (_, id) => {
      removeProduct(id);
      queryClient.invalidateQueries({ queryKey: ["products"] });
      Swal.fire("Éxito", "Producto eliminado correctamente", "success");
    },
    onError: () => {
      Swal.fire("Error", "No se pudo eliminar el producto", "error");
    },
  });

  return {
    productsQuery,
    createProductMutation,
    updateProductMutation,
    deleteProductMutation,
  };
};
