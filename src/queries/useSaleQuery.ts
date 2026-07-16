import { useMutation, useQuery } from "@tanstack/react-query";
import { useStore } from "../store/store";
import { useEffect } from "react";
import { offlineService } from "../services/offline";
import { saleService } from "../services/saleService";
import { Sale } from "../models/sale";
import { queryClient } from "./queryClient";
import { isElectron } from "../utils/platform";

export const useSaleQuery = () => {
  const setSales = useStore((s) => s.setSales);

  const saleQuery = useQuery({
    queryKey: ["sales"],
    queryFn: async () => {
      if (isElectron) {
        try {
          const data = await saleService.getSales();
          offlineService.sales.save(data).catch(() => {});
          return data;
        } catch {
          return offlineService.sales.get();
        }
      }
      return saleService.getSales();
    },
    staleTime: isElectron ? 1000 * 60 * 30 : 0,
  });

  useEffect(() => {
    if (saleQuery.data) setSales(saleQuery.data);
  }, [saleQuery.data, setSales]);

  const createSaleMutation = useMutation({
    mutationFn: async (sale: Sale) => {
      if (isElectron) {
        const local = await offlineService.sales.create(sale);
        try {
          await saleService.createSale(sale);
        } catch {
          // syncService will retry later
        }
        return local;
      }
      return saleService.createSale(sale);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["sales"] });
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });

  return {
    saleQuery,
    createSaleMutation,
  };
};
