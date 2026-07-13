import { useMemo } from "react";
import { useStore } from "../store/store";
import { Mode, Period, Range } from "../models/analytic";
import { useSupplierQuery } from "../queries/useSupplierQuery";
import {
  isSameDay,
  isSameWeek,
  isSameMonth,
  isSameYear,
} from "date-fns";

export interface SupplierAnalytics {
  supplier_id: number;
  supplier_name: string;
  totalInvestment: number;
  totalRevenue: number;
  profit: number;
  productsBought: number;
  totalUnits: number;
}

export const useSupplierAnalytics = (
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
  const { suppliersQuery } = useSupplierQuery();
  const suppliers = useMemo(() => suppliersQuery.data ?? [], [suppliersQuery.data]);
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

  const supplierAnalytics: SupplierAnalytics[] = useMemo(() => {
    const productCostMap = new Map<number, number>();
    products.forEach((p) => productCostMap.set(p.product_id, p.cost));

    const productSupplierMap = new Map<number, number>();
    products.forEach((p) => {
      if (p.supplier_id) {
        productSupplierMap.set(p.product_id, p.supplier_id);
      }
    });

    const supplierNameMap = new Map<number, string>();
    suppliers.forEach((s) => supplierNameMap.set(s.supplier_id, s.name));

    const map: Record<
      number,
      {
        totalInvestment: number;
        totalRevenue: number;
        productsSet: Set<number>;
        totalUnits: number;
      }
    > = {};

    filteredSales.forEach((sale) => {
      sale.sale_products.forEach((sp) => {
        const supplierId = productSupplierMap.get(sp.product_id);
        if (supplierId) {
          if (!map[supplierId]) {
            map[supplierId] = {
              totalInvestment: 0,
              totalRevenue: 0,
              productsSet: new Set(),
              totalUnits: 0,
            };
          }
          const entry = map[supplierId];
          const saleCost = sp.cost ?? 0;
          const currentCost = productCostMap.get(sp.product_id) ?? 0;
          const effectiveCost = saleCost > 0 ? saleCost : currentCost;
          entry.totalInvestment += effectiveCost * sp.quantity;
          entry.totalRevenue += sp.price * sp.quantity;
          entry.productsSet.add(sp.product_id);
          entry.totalUnits += sp.quantity;
        }
      });
    });

    return Object.entries(map)
      .map(([id, data]) => ({
        supplier_id: Number(id),
        supplier_name: supplierNameMap.get(Number(id)) ?? "Desconocido",
        totalInvestment: data.totalInvestment,
        totalRevenue: data.totalRevenue,
        profit: data.totalRevenue - data.totalInvestment,
        productsBought: data.productsSet.size,
        totalUnits: data.totalUnits,
      }))
      .sort((a, b) => b.totalInvestment - a.totalInvestment);
  }, [filteredSales, products, suppliers]);

  const totalInvestment = supplierAnalytics.reduce(
    (sum, s) => sum + s.totalInvestment,
    0
  );
  const totalRevenue = supplierAnalytics.reduce(
    (sum, s) => sum + s.totalRevenue,
    0
  );
  const totalProfit = totalRevenue - totalInvestment;

  return {
    filteredSales,
    supplierAnalytics,
    totalInvestment,
    totalRevenue,
    totalProfit,
  };
};
