import { useMutation, useQuery } from "@tanstack/react-query";
import { saleService } from "../services/saleService";
import { queryClient } from "./queryClient";
import { Sale } from "../models/sale";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { useStore } from "../store/store";

export const useSaleQuery = () => {
  const setSales = useStore((s) => s.setSales);
  const resetSaleDetail = useStore((s) => s.resetSaleDetail);
  const saleQuery = useQuery({
    queryKey: ["sales"],
    queryFn: saleService.getSales,
    staleTime: 1000 * 60 * 30,
  });

  useEffect(() => {
    if (saleQuery.data) setSales(saleQuery.data);
  }, [saleQuery.data, setSales]);

  const createSaleMutation = useMutation({
    mutationFn: (sale: Sale) => saleService.createSale(sale),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"], exact: true });
      queryClient.invalidateQueries({ queryKey: ["products"], exact: true });
      queryClient.invalidateQueries({ queryKey: ["history"], exact: true });
      resetSaleDetail();
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
