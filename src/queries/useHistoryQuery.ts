import { useQuery } from "@tanstack/react-query";
import { useStore } from "../store/store";
import { saleService } from "../services/saleService";
import { useEffect } from "react";
import { offlineService, networkService } from "../services/offline";

export const useHistoryQuery = () => {
  const setHistory = useStore((s) => s.setSales);
  const historyQuery = useQuery({
    queryKey: ["history"],
    queryFn: async () => {
      if (networkService.isOnline) {
        const data = await saleService.getSales();
        offlineService.sales.save(data);
        return data;
      }
      return offlineService.sales.get();
    },
    staleTime: 1000 * 60 * 60,
  });

  useEffect(() => {
    if (historyQuery.data) {
      setHistory(historyQuery.data);
    }
  }, [setHistory, historyQuery.data]);

  return {
    historyQuery,
  };
};
