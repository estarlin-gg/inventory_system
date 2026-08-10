import { useMemo } from "react";
import { useStore } from "../store/store";
import { Mode, Period, Range } from "../models/analytic";
import { useSupplierQuery } from "../queries/useSupplierQuery";
import { productService } from "../services/productService";
import { useQuery } from "@tanstack/react-query";
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
  inventoryInvestment: number;
  totalStock: number;
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

  const pairsQuery = useQuery({
    queryKey: ["productSupplierPairs"],
    queryFn: () => productService.getAllProductSupplierPairs(),
    staleTime: 0,
  });
  const pairs = useMemo(() => pairsQuery.data ?? [], [pairsQuery.data]);

  const productToSuppliers = useMemo(() => {
    const map = new Map<number, Set<number>>();
    pairs.forEach((p) => {
      if (!map.has(p.product_id)) map.set(p.product_id, new Set());
      map.get(p.product_id)!.add(p.supplier_id);
    });
    return map;
  }, [pairs]);

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
    const productMap = new Map<number, { cost: number; discount: number; stock: number }>();
    products.forEach((p) =>
      productMap.set(p.product_id, { cost: p.cost, discount: p.discount ?? 0, stock: p.stock })
    );

    const supplierNameMap = new Map<number, string>();
    suppliers.forEach((s) => supplierNameMap.set(s.supplier_id, s.name));

    const map: Record<
      number,
      {
        totalInvestment: number;
        totalRevenue: number;
        productsSet: Set<number>;
        totalUnits: number;
        inventoryInvestment: number;
        totalStock: number;
      }
    > = {};

    products.forEach((p) => {
      const supplierIds = productToSuppliers.get(p.product_id);
      if (supplierIds) {
        supplierIds.forEach((sid) => {
          if (!map[sid]) {
            map[sid] = {
              totalInvestment: 0,
              totalRevenue: 0,
              productsSet: new Set(),
              totalUnits: 0,
              inventoryInvestment: 0,
              totalStock: 0,
            };
          }
          map[sid].inventoryInvestment += p.cost * p.stock;
          map[sid].totalStock += p.stock;
          map[sid].productsSet.add(p.product_id);
        });
      }
    });

    filteredSales.forEach((sale) => {
      sale.sale_products.forEach((sp) => {
        const supplierIds = productToSuppliers.get(sp.product_id);
        if (supplierIds) {
          const prod = productMap.get(sp.product_id);
          supplierIds.forEach((supplierId) => {
            if (!map[supplierId]) {
              map[supplierId] = {
                totalInvestment: 0,
                totalRevenue: 0,
                productsSet: new Set(),
                totalUnits: 0,
                inventoryInvestment: 0,
                totalStock: 0,
              };
            }
            const entry = map[supplierId];
            const saleCost = sp.cost ?? 0;
            const currentCost = prod?.cost ?? 0;
            const effectiveCost = saleCost > 0 ? saleCost : currentCost;
            const discountPct = prod?.discount ?? 0;
            const effectivePrice = discountPct > 0
              ? sp.price - sp.price * (discountPct / 100)
              : sp.price;
            entry.totalInvestment += effectiveCost * sp.quantity;
            entry.totalRevenue += effectivePrice * sp.quantity;
            entry.productsSet.add(sp.product_id);
            entry.totalUnits += sp.quantity;
          });
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
        inventoryInvestment: data.inventoryInvestment,
        totalStock: data.totalStock,
      }))
      .sort((a, b) => b.inventoryInvestment - a.inventoryInvestment);
  }, [filteredSales, products, suppliers, productToSuppliers]);

  const totalInvestment = supplierAnalytics.reduce(
    (sum, s) => sum + s.totalInvestment,
    0
  );
  const totalRevenue = supplierAnalytics.reduce(
    (sum, s) => sum + s.totalRevenue,
    0
  );
  const totalProfit = totalRevenue - totalInvestment;
  const totalInventoryInvestment = supplierAnalytics.reduce(
    (sum, s) => sum + s.inventoryInvestment,
    0
  );

  return {
    filteredSales,
    supplierAnalytics,
    totalInvestment,
    totalRevenue,
    totalProfit,
    totalInventoryInvestment,
  };
};
