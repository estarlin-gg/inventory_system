import { useEffect, useState } from "react";
import { useStore } from "../store/store";

export const useSearch = () => {
  const products = useStore((state) => state.products);
  // const sales = useStore((state) => state.sales);
  const [search, setSearch] = useState("");
  const [filteredP, setFilteredP] = useState(products);
  const [history, setHistory] = useState("");

  useEffect(() => {
    const filtered = products.filter((product) =>
      product.product_name.toLowerCase().includes(search.toLowerCase())
    );
    // const historyf = sales.;
   
    setFilteredP(filtered);
  }, [search, products, history]);

  return {
    search,
    setSearch,
    filteredP,
    history,
    setHistory
  };
};
