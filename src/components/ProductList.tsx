import { Product } from "../models/product";

import { ProductCard } from "./ProductCard";

interface ProductListProps {
  type: "sale" | "edit";
  data: Product[];
}

export const ProductList = ({ type, data }: ProductListProps) => {
  return (
    <div className="grid place-content-stretch grid-cols-1 sm:grid-cols-2 gap-3 xl:grid-cols-4">
      {data.map((p) => (
        <ProductCard key={p.product_id} product={p} type={type} />
      ))}
    </div>
  );
};
