import { useSaleQuery } from "../queries/useSaleQuery";
import { useStore } from "../store/store";
import Swal from "sweetalert2";
import { queryClient } from "../queries/queryClient";
import { Sale } from "../models/sale";
import { toast } from "react-toastify";

export const useSaleActions = () => {
  const { saleQuery, createSaleMutation } = useSaleQuery();
  const resetSaleDetail = useStore((s) => s.resetSaleDetail);
  const setLoading = useStore((s) => s.setLoading);


  const handleCreateSale = (sale: Sale) => {
    if (sale.sale_products.length <= 0) {
      toast.error("La venta debe tener al menos un producto.");
      return;
    }
    if (sale.customer_name.trim() === "") {
      sale.customer_name = "Cliente Desconocido";
    }
    setLoading(true);

    createSaleMutation.mutate(sale, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["sales"] });
        queryClient.invalidateQueries({ queryKey: ["products"] });
        queryClient.invalidateQueries({ queryKey: ["history"] });

        Swal.fire("Éxito", "Venta realizada con exito", "success");

        resetSaleDetail();
        setLoading(false);
      },

      onError: () => {
        Swal.fire("Error", "Hubo un error al crear la venta", "error");
        setLoading(false);
      },
    });
  };

  return {
    saleQuery,
    handleCreateSale,
    isCreatingSale: createSaleMutation.isPending,
  };
};
