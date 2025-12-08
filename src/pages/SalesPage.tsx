// import { useEffect } from "react";
import { Badge, Button, TextInput } from "flowbite-react";
import { ProductList } from "../components/products/ProductList";

import { useSearch } from "../hooks/useSearch";
import { useStore } from "../store/store";
import { FaClipboardList } from "react-icons/fa";
import { ShoopList } from "../components/sales/ShoopList";
import { Loading } from "../components/ui/Loading";
import { useProductQuery } from "../queries/useProductQuery";

export const SalesPage = () => {
  const isShoppingListopen = useStore((s) => s.isShoppingListopen);
  const handleShoppingList = useStore((s) => s.handleShoppingList);
  const shoppingList = useStore((s) => s.shoppingList);
  const { filteredP, setSearch } = useSearch();
  const { productsQuery } = useProductQuery();

  if (productsQuery.isLoading) return <Loading />;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <TextInput
          onChange={(e) => setSearch(e.target.value)}
          type="search"
          placeholder="Buscar...."
          className="w-full"
          sizing="md"
        />

        <Button
          onClick={handleShoppingList}
          className="rounded-lg relative"
          color="yellow"
          size="md"
        >
          {shoppingList.length > 0 && (
            <Badge className="absolute -top-3 right-0.5 rounded-full">
              {shoppingList.length}
            </Badge>
          )}
          <FaClipboardList />
        </Button>
      </div>
      <ShoopList open={isShoppingListopen} onClose={handleShoppingList} />
      <ProductList data={filteredP} type="sale" />
    </div>
  );
};
