import { useMutation, useQuery } from "@tanstack/react-query";
import { saleService } from "../services/saleService";
import { Sale } from "../models/sale";
import { useEffect } from "react";
import { useStore } from "../store/store";

export const useSaleQuery = () => {
  const setSales = useStore((s) => s.setSales);
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
  });

  return {
    saleQuery,
    createSaleMutation,
  };
};
