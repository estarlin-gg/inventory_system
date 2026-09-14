import { useSupplierQuery } from "../queries/useSupplierQuery";
import { SupplierCreate } from "../models/supplier";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useStore } from "../store/store";

export const useSupplierActions = () => {
  const {
    suppliersQuery,
    createSupplierMutation,
    updateSupplierMutation,
    deleteSupplierMutation,
  } = useSupplierQuery();
  const setLoading = useStore((s) => s.setLoading);

  const handleCreateSupplier = (data: SupplierCreate, onSuccess?: () => void) => {
    setLoading(true);
    createSupplierMutation.mutate(data, {
      onSettled: () => setLoading(false),
      onSuccess: () => {
        toast.success("Proveedor creado exitosamente");
        onSuccess?.();
      },
      onError: () => {
        toast.error("Error al crear el proveedor");
      },
    });
  };

  const handleUpdateSupplier = (id: number, data: Partial<SupplierCreate>, onSuccess?: () => void) => {
    setLoading(true);
    updateSupplierMutation.mutate({ id, s: data }, {
      onSettled: () => setLoading(false),
      onSuccess: () => {
        toast.success("Proveedor actualizado exitosamente");
        onSuccess?.();
      },
      onError: () => {
        toast.error("Error al actualizar el proveedor");
      },
    });
  };

  const handleDeleteSupplier = (id: number) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);
        deleteSupplierMutation.mutate(id, {
          onSettled: () => setLoading(false),
          onSuccess: () => {
            Swal.fire("Eliminado", "Proveedor eliminado", "success");
          },
          onError: () => {
            toast.error("Error al eliminar el proveedor");
          },
        });
      }
    });
  };

  return {
    suppliersQuery,
    handleCreateSupplier,
    handleUpdateSupplier,
    handleDeleteSupplier,
  };
};
