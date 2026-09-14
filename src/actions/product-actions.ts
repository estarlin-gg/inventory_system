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
  const handleCreateProduct = async (data: ProductCreate, onSuccess?: () => void) => {
    setLoading(true);
    try {
      const created = await createProductMutation.mutateAsync(data);
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      Swal.fire("Éxito", "Producto creado correctamente", "success");
      onSuccess?.();
      return created;
    } catch (err) {
      Swal.fire("Error", "No se pudo crear el producto", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // UPDATE
  const handleUpdateProduct = async (id: number, p: ProductCreate, onSuccess?: () => void) => {
    setLoading(true);
    try {
      const updated = await updateProductMutation.mutateAsync({ id, p });
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      Swal.fire("Éxito", "Producto actualizado correctamente", "success");
      onSuccess?.();
      return updated;
    } catch (err) {
      Swal.fire("Error", "No se pudo actualizar el producto", "error");
      console.error("ERROR AL ACTUALIZAR", err);
    } finally {
      setLoading(false);
    }
  };

  // DELETE
  const handleDeleteProduct = async (id: number) => {
    setLoading(true);
    try {
      await deleteProductMutation.mutateAsync(id);
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      Swal.fire("Éxito", "Producto eliminado correctamente", "success");
    } catch (err) {
      Swal.fire("Error", "No se pudo eliminar el producto", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    productsQuery,
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct,
  };
};
