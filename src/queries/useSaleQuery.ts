import { useMutation, useQuery } from "@tanstack/react-query";
import { saleService } from "../services/saleService";
import { Sale } from "../models/sale";
import { useEffect } from "react";
import { useStore } from "../store/store";
import { offlineService, networkService } from "../services/offline";

export const useSaleQuery = () => {
  const setSales = useStore((s) => s.setSales);
  const saleQuery = useQuery({
    queryKey: ["sales"],
    queryFn: async () => {
      if (networkService.isOnline) {
        const data = await saleService.getSales();
        offlineService.sales.save(data);
        return data;
      }
      return offlineService.sales.get();
    },
    staleTime: 1000 * 60 * 30,
  });

  useEffect(() => {
    if (saleQuery.data) setSales(saleQuery.data);
  }, [saleQuery.data, setSales]);

  const createSaleMutation = useMutation({
    mutationFn: async (sale: Sale) => {
      if (networkService.isOnline) {
        return saleService.createSale(sale);
      }
      return offlineService.sales.create(sale);
    },
  });

  return {
    saleQuery,
    createSaleMutation,
  };
};
