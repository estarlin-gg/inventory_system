import { useQuery } from "@tanstack/react-query";
import { useStore } from "../store/store";
import { saleService } from "../services/saleService";
import { useEffect } from "react";

export const useHistoryQuery = () => {
  const setHistory = useStore((s) => s.setSales);
  const historyQuery = useQuery({
    queryKey: ["history"],
    queryFn: saleService.getSales,
    staleTime: 1000 * 60 * 60,

  });

  useEffect(() => {
    if (historyQuery.data) {
      console.log(historyQuery.data);
      setHistory(historyQuery.data);
    }
  }, [setHistory, historyQuery.data]);

  return {
    historyQuery,
  };
};
