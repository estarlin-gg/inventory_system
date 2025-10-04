import { useMutation, useQuery } from "@tanstack/react-query";
import { saleService } from "../services/saleService";
import { queryClient } from "./queryClient";
import { Sale } from "../models/sale";
import Swal from "sweetalert2";
export const useSaleQuery = () => {
  const saleQuery = useQuery({
    queryKey: ["sales"],
    queryFn: saleService.getSales,
  });

  const createSaleMutation = useMutation({
    mutationFn: (sale: Sale) => saleService.createSale(sale),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      Swal.fire("Éxito", "Venta realizada con exito", "success");
    },
    onError: () => {
      Swal.fire("Upps", "Hubo un error al crear la venta", "error");
    },
  });

  return {
    saleQuery,
    createSaleMutation,
  };
};
