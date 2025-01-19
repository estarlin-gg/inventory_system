import { useEffect } from "react";
import { useAppStore } from "../store/appStore";
import { useAuth } from "../hooks/useAuth";
import { ProductItem } from "./ProductItem";

interface ProductListProps {
  path: "sales" | "products";
  classes?: string;
}

export const ProductList = ({ path, classes }: ProductListProps) => {
  const getProducts = useAppStore((state) => state.getProducts);
  const products = useAppStore((state) => state.products);
  const { credentials } = useAuth();

  useEffect(() => {
    if (credentials?.id) {
      getProducts(credentials.id);
    }
  }, [credentials?.id, getProducts]);

  return (
    <div className={`flex flex-col gap-4 h-[calc(100vh-220px)] no-scrollbar  ${classes}`}>
      {products.map((p) => (
        <ProductItem key={p.id} path={path} product={p} />
      ))}
    </div>
  );
};
