import { Product } from "../../models/product";

import { ProductCard } from "./ProductCard";

interface ProductListProps {
  type: "sale" | "edit";
  data: Product[];
  emptyMessage?: string;
}

export const ProductList = ({ type, data, emptyMessage }: ProductListProps) => {
  if (data.length === 0) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 py-10">
        {emptyMessage ?? "No hay productos para mostrar"}
      </p>
    );
  }

  return (
    <div className="grid place-content-stretch grid-cols-1 sm:grid-cols-2 gap-3 xl:grid-cols-3 4xl:grid-cols-4">
      {data.map((p) => (
        <ProductCard key={p.product_id} product={p} type={type} />
      ))}
    </div>
  );
};
