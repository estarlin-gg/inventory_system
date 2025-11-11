import { useMemo } from "react";
import {
  isSameDay,
  isSameWeek,
  isSameMonth,
  isSameYear,
  format,
} from "date-fns";
import { es } from "date-fns/locale";
import { useStore } from "../store/store";

export type Period = "day" | "week" | "month" | "year";
export type Mode = "period" | "yearly" | "range" | "monthly";

interface Range {
  startDate: Date;
  endDate: Date;
}

export const useAnalytics = (
  period: Period,
  mode?: Mode,
  options?: {
    month?: number;
    year?: number;
    range?: Range;
  }
) => {
  const sales = useStore((s) => s.sales);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const today = new Date();

  // FILTRADO según modo
  const filteredSales = useMemo(() => {
    switch (mode) {
      case "period":
        switch (period) {
          case "day":
            return sales.filter((s) =>
              isSameDay(new Date(s.created_at), today)
            );
          case "week":
            return sales.filter((s) =>
              isSameWeek(new Date(s.created_at), today)
            );
          case "month":
            return sales.filter((s) =>
              isSameMonth(new Date(s.created_at), today)
            );
          case "year":
            return sales.filter((s) =>
              isSameYear(new Date(s.created_at), today)
            );
          default:
            return sales;
        }

      case "monthly":
        if (options?.month != null && options?.year != null) {
          return sales.filter((s) => {
            const d = new Date(s.created_at);
            return (
              d.getMonth() === options.month && d.getFullYear() === options.year
            );
          });
        }
        return [];

      case "yearly":
        if (options?.year != null) {
          return sales.filter(
            (s) => new Date(s.created_at).getFullYear() === options.year
          );
        }
        return [];

      case "range":
        if (options?.range) {
          const { startDate, endDate } = options.range;
          return sales.filter((s) => {
            const d = new Date(s.created_at);
            return d >= startDate && d <= endDate;
          });
        }
        return [];

      default:
        return sales;
    }
  }, [mode, period, sales, options, today]);

  // AGRUPADO PARA GRÁFICO
  const groupedData = useMemo(() => {
    const groups: Record<string, number> = {};

    filteredSales.forEach((sale) => {
      const date = new Date(sale.created_at);
      let key = "";

      switch (mode) {
        case "period":
          switch (period) {
            case "day":
              key = format(date, "HH:mm");
              break;
            case "week":
              key = format(date, "EEEE", { locale: es });
              break;
            case "month":
              key = format(date, "d 'de' MMM", { locale: es });
              break;
            case "year":
              key = format(date, "MMM", { locale: es });
              break;
          }
          break;

        case "monthly":
          key = format(date, "d 'de' MMM", { locale: es });
          break;

        case "yearly":
          key = format(date, "MMM", { locale: es });
          break;

        case "range":
          key = format(date, "d 'de' MMM", { locale: es });
          break;
      }

      groups[key] = (groups[key] || 0) + sale.total_pay;
    });

    return Object.entries(groups).map(([name, total]) => ({
      name,
      total,
    }));
  }, [filteredSales, mode, period]);

  //CALCULOS TOTALES
  const totalIncome = filteredSales.reduce((sum, s) => sum + s.total_pay, 0);
  const totalStock = filteredSales.reduce(
    (sum, s) => sum + s.sale_products.reduce((sub, p) => sub + p.quantity, 0),
    0
  );
  const totalSales = filteredSales.length;

  const salesOfTheDay = sales.filter((sale) =>
    isSameDay(new Date(sale.created_at), today)
  );

  return {
    filteredSales,
    groupedData,
    totalIncome,
    totalStock,
    totalSales,
    salesOfTheDay,
  };
};
