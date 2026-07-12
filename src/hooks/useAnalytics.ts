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
import { Mode, Period, ProductAnalytics, Range } from "../models/analytic";

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

  // ===========================
  // FILTRADO
  // ===========================
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
        }
        return sales;

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

  // ===========================
  // AGRUPADO PARA GRÁFICOS
  // ===========================
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

  // ===========================
  // PRODUCTOS VENDIDOS (TIPADO)
  // ===========================
  const productsAnalytics: ProductAnalytics[] = useMemo(() => {
    const map: Record<
      number,
      {
        id: number;
        product_name: string;
        units: number;
        total: number;
      }
    > = {};

    filteredSales.forEach((sale) => {
      sale.sale_products.forEach((p) => {
        if (!map[p.product_id]) {
          map[p.product_id] = {
            id: p.product_id,
            product_name: p.product_name,
            units: 0,
            total: 0,
          };
        }

        map[p.product_id].units += p.quantity;
        map[p.product_id].total += p.quantity * p.price;
      });
    });

    return Object.values(map);
  }, [filteredSales]);

  // ===========================
  // TOP 5 PRODUCTOS
  // ===========================
  const top5Products: ProductAnalytics[] = useMemo(() => {
    return [...productsAnalytics].sort((a, b) => b.units - a.units).slice(0, 5);
  }, [productsAnalytics]);

  // ===========================
  // TOTALES
  // ===========================
  const totalIncome = filteredSales.reduce((s, t) => s + t.total_pay, 0);
  const totalStock = filteredSales.reduce(
    (s, sale) => s + sale.sale_products.reduce((acc, p) => acc + p.quantity, 0),
    0
  );
  const totalSales = filteredSales.length;

  const totalInvestment = filteredSales.reduce(
    (s, sale) =>
      s +
      sale.sale_products.reduce(
        (acc, p) => acc + (p.cost ?? 0) * p.quantity,
        0
      ),
    0
  );
  const totalProfit = totalIncome - totalInvestment;

  const salesOfTheDay = sales.filter((sale) =>
    isSameDay(new Date(sale.created_at), today)
  );

  const incomeToday = salesOfTheDay.reduce((acc, t) => acc + t.total_pay, 0);
  const salesToday = salesOfTheDay.length;
  const stocksToday = salesOfTheDay.reduce(
    (acc, t) => acc + t.sale_products.reduce((a, b) => a + b.quantity, 0),
    0
  );

  return {
    filteredSales,
    groupedData,
    totalIncome,
    totalStock,
    totalSales,
    totalInvestment,
    totalProfit,
    incomeToday,
    stocksToday,
    salesToday,
    salesOfTheDay,
    productsAnalytics,
    top5Products,
  };
};
