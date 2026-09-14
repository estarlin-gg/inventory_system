import { useProductQuery } from "../queries/useProductQuery";
import Swal from "sweetalert2";

import { ProductCreate } from "../models/product";
import { queryClient } from "../queries/queryClient";
import { useStore } from "../store/store";

export const useProductActions = () => {
  const {
    productsQuery,
    createProductMutation,
    updateProductMutation,
    deleteProductMutation,
  } = useProductQuery();
  const setLoading = useStore((s) => s.setLoading);

  // CREATE
  const handleCreateProduct = (data: ProductCreate, onSuccess?: () => void) => {
    setLoading(true);
    createProductMutation.mutate(data, {
      onSettled: () => setLoading(false),
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["products"] });
        await queryClient.refetchQueries({ queryKey: ["products"] });
        Swal.fire("Éxito", "Producto creado correctamente", "success");
        onSuccess?.();
      },
      onError: (err) => {
        Swal.fire("Error", "No se pudo crear el producto", "error");
        console.error(err);
      },
    });
  };

  // UPDATE
  const handleUpdateProduct = (id: number, p: ProductCreate, onSuccess?: () => void) => {
    setLoading(true);
    updateProductMutation.mutate(
      { id, p },
      {
        onSettled: () => setLoading(false),
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: ["products"] });
          await queryClient.refetchQueries({ queryKey: ["products"] });
          Swal.fire("Éxito", "Producto actualizado correctamente", "success");
          onSuccess?.();
        },
        onError: (err) => {
          Swal.fire("Error", "No se pudo actualizar el producto", "error");
          console.error("ERROR AL ACTUALIZAR", err);
        },
      }
    );
  };

  // DELETE
  const handleDeleteProduct = (id: number) => {
    setLoading(true);
    deleteProductMutation.mutate(id, {
      onSettled: () => setLoading(false),
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["products"] });
        await queryClient.refetchQueries({ queryKey: ["products"] });
        Swal.fire("Éxito", "Producto eliminado correctamente", "success");
      },
      onError: (err) => {
        Swal.fire("Error", "No se pudo eliminar el producto", "error");
        console.error(err);
      },
    });
  };

  return {
    productsQuery,
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct,
  };
};
