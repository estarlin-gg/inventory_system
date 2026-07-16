import { useQuery } from "@tanstack/react-query";
import { useStore } from "../store/store";
import { useEffect } from "react";
import { offlineService } from "../services/offline";
import { saleService } from "../services/saleService";
import { isElectron } from "../utils/platform";

export const useHistoryQuery = () => {
  const setHistory = useStore((s) => s.setSales);

  const historyQuery = useQuery({
    queryKey: ["history"],
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
    staleTime: isElectron ? 1000 * 60 * 60 : 0,
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
