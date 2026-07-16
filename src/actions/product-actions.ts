import { useProductQuery } from "../queries/useProductQuery";
import Swal from "sweetalert2";

import { ProductCreate } from "../models/product";
import { queryClient } from "../queries/queryClient";

export const useProductActions = () => {
  const {
    productsQuery,
    createProductMutation,
    updateProductMutation,
    deleteProductMutation,
  } = useProductQuery();

  // CREATE
  const handleCreateProduct = (data: ProductCreate, onSuccess?: () => void) => {
    createProductMutation.mutate(data, {
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
    updateProductMutation.mutate(
      { id, p },
      {
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
    deleteProductMutation.mutate(id, {
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
