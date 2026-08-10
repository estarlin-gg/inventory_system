import { useMemo } from "react";
import { useStore } from "../store/store";
import { productService } from "../services/productService";
import { useQuery } from "@tanstack/react-query";

export interface NoSupplierProduct {
  product_id: number;
  product_name: string;
  cost: number;
  price: number;
  stock: number;
  totalInvestment: number;
}

export const useNoSupplierAnalytics = () => {
  const products = useStore((s) => s.products);

  const pairsQuery = useQuery({
    queryKey: ["productSupplierPairs"],
    queryFn: () => productService.getAllProductSupplierPairs(),
    staleTime: 0,
  });
  const pairs = useMemo(() => pairsQuery.data ?? [], [pairsQuery.data]);

  const linkedProductIds = useMemo(() => {
    return new Set(pairs.map((p) => p.product_id));
  }, [pairs]);

  const noSupplierProducts = useMemo(() => {
    return products
      .filter((p) => !linkedProductIds.has(p.product_id))
      .map((p): NoSupplierProduct => ({
        product_id: p.product_id,
        product_name: p.product_name,
        cost: p.cost,
        price: p.price,
        stock: p.stock,
        totalInvestment: p.cost * p.stock,
      }))
      .sort((a, b) => b.totalInvestment - a.totalInvestment);
  }, [products, linkedProductIds]);

  const totalInvestment = noSupplierProducts.reduce(
    (sum, p) => sum + p.totalInvestment,
    0
  );
  const totalStock = noSupplierProducts.reduce(
    (sum, p) => sum + p.stock,
    0
  );

  return {
    noSupplierProducts,
    totalInvestment,
    totalStock,
    count: noSupplierProducts.length,
  };
};
