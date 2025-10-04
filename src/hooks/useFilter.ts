import { useState, useMemo } from "react";
import { Sale } from "../models/sale";

export const useFilter = (originalData: Sale[]) => {
  const [query, setQuery] = useState("");
  const [date, setDate] = useState<Date | null>(null);

  const filteredData = useMemo(() => {
    return originalData.filter((sale) => {
      const matchesQuery =
        sale.id!.toString().includes(query.toLowerCase()) ||
        sale.customer_name.toLowerCase().includes(query.toLowerCase());

      const matchesDate = date
        ? new Date(sale.created_at).toDateString() === date.toDateString()
        : true;

      return matchesQuery && matchesDate;
    });
  }, [originalData, query, date]);

  return {
    filteredData,
    query,
    setQuery,
    date,
    setDate,
  };
};
