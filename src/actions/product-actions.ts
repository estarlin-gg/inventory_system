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
  const handleCreateProduct = (data: ProductCreate) => {
    setLoading(true)
    createProductMutation.mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["products"] });
        Swal.fire("Éxito", "Producto creado correctamente", "success");
        setLoading(false)
      },
      onError: (err) => {
        Swal.fire("Error", "No se pudo crear el producto", "error");
        console.error(err);
        setLoading(false)
      },
    });
  };

  // UPDATE
  const handleUpdateProduct = (id: number, p: ProductCreate) => {
    // setLoading(true)
    updateProductMutation.mutate(
      { id, p },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["products"] });
          Swal.fire("Éxito", "Producto actualizado correctamente", "success");
          // setLoading(false)
        },
        onError: (err) => {
          Swal.fire("Error", "No se pudo actualizar el producto", "error");
          console.error("ERROR AL ACTUALIZAR", err);
          // setLoading(false)
        },
      }
    );
  };

  // DELETE
  const handleDeleteProduct = (id: number) => {
    setLoading(true)
    deleteProductMutation.mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["products"] });
        Swal.fire("Éxito", "Producto eliminado correctamente", "success");
        setLoading(false)
      },
      onError: (err) => {
        Swal.fire("Error", "No se pudo eliminar el producto", "error");
        console.error(err);
        setLoading(false)
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
