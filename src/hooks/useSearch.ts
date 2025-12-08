import { useState, useMemo } from "react";
import { useProductQuery } from "../queries/useProductQuery";

export const useSearch = () => {
  const { productsQuery } = useProductQuery();
  const [search, setSearch] = useState("");
  const [history, setHistory] = useState("");

  const filteredP = useMemo(() => {
    const data = productsQuery.data ?? [];

    return data.filter((product) =>
      product.product_name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, productsQuery.data]);

  return {
    search,
    setSearch,
    filteredP,
    history,
    setHistory,
  };
};
