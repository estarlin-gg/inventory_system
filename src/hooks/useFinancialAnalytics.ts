import { useMemo } from "react";
import { useStore } from "../store/store";
import { Mode, Period, ProductFinancial, Range } from "../models/analytic";
import {
  isSameDay,
  isSameWeek,
  isSameMonth,
  isSameYear,
} from "date-fns";

export const useFinancialAnalytics = (
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

  const productFinancials: ProductFinancial[] = useMemo(() => {
    const map: Record<
      number,
      {
        id: number;
        product_name: string;
        cost: number;
        price: number;
        units: number;
        totalRevenue: number;
        totalCost: number;
      }
    > = {};

    filteredSales.forEach((sale) => {
      sale.sale_products.forEach((p) => {
        if (!map[p.product_id]) {
          map[p.product_id] = {
            id: p.product_id,
            product_name: p.product_name,
            cost: p.cost ?? 0,
            price: p.price,
            units: 0,
            totalRevenue: 0,
            totalCost: 0,
          };
        }

        const entry = map[p.product_id];
        entry.units += p.quantity;
        entry.totalRevenue += p.quantity * p.price;
        entry.totalCost += p.quantity * (p.cost ?? 0);
      });
    });

    return Object.values(map).map((p) => ({
      ...p,
      profit: p.totalRevenue - p.totalCost,
    }));
  }, [filteredSales]);

  const totalInvestment = productFinancials.reduce((s, p) => s + p.totalCost, 0);
  const totalRevenue = productFinancials.reduce((s, p) => s + p.totalRevenue, 0);
  const totalProfit = totalRevenue - totalInvestment;

  return {
    filteredSales,
    productFinancials,
    totalInvestment,
    totalRevenue,
    totalProfit,
  };
};
