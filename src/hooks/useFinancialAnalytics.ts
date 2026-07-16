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
  const products = useStore((s) => s.products);
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
    const productMap = new Map<number, { cost: number; discount: number }>();
    products.forEach((p) =>
      productMap.set(p.product_id, { cost: p.cost, discount: p.discount ?? 0 })
    );

    const map: Record<
      number,
      {
        id: number;
        product_name: string;
        cost: number;
        price: number;
        discount: number;
        units: number;
        totalRevenue: number;
        totalCost: number;
      }
    > = {};

    filteredSales.forEach((sale) => {
      sale.sale_products.forEach((p) => {
        if (!map[p.product_id]) {
          const prod = productMap.get(p.product_id);
          const currentCost = prod?.cost ?? 0;
          const discount = prod?.discount ?? 0;
          map[p.product_id] = {
            id: p.product_id,
            product_name: p.product_name,
            cost: currentCost,
            price: p.price,
            discount,
            units: 0,
            totalRevenue: 0,
            totalCost: 0,
          };
        }

        const entry = map[p.product_id];
        const saleCost = p.cost ?? 0;
        const currentCost = productMap.get(p.product_id)?.cost ?? 0;
        const effectiveCost = saleCost > 0 ? saleCost : currentCost;

        const discountPct = entry.discount;
        const effectivePrice = discountPct > 0
          ? p.price - p.price * (discountPct / 100)
          : p.price;

        entry.units += p.quantity;
        entry.totalRevenue += p.quantity * effectivePrice;
        entry.totalCost += p.quantity * effectiveCost;
      });
    });

    return Object.values(map).map((p) => ({
      ...p,
      profit: p.totalRevenue - p.totalCost,
    }));
  }, [filteredSales, products]);

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
