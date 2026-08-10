import { useSupplierQuery } from "../queries/useSupplierQuery";
import { SupplierCreate } from "../models/supplier";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export const useSupplierActions = () => {
  const {
    suppliersQuery,
    createSupplierMutation,
    updateSupplierMutation,
    deleteSupplierMutation,
  } = useSupplierQuery();

  const handleCreateSupplier = (data: SupplierCreate, onSuccess?: () => void) => {
    createSupplierMutation.mutate(data, {
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
    updateSupplierMutation.mutate({ id, s: data }, {
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
        deleteSupplierMutation.mutate(id, {
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
