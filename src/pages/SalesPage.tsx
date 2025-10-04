// import { useEffect } from "react";
import { Badge, Button, TextInput } from "flowbite-react";
import { ProductList } from "../components/ProductList";

import { useSearch } from "../hooks/useSearch";
import { useStore } from "../store/store";
import { FaClipboardList } from "react-icons/fa";
import { ShoopList } from "../components/ShoopList";
import { Loading } from "../components/Loading";
import { useProducts } from "../queries/useProduct";

export const SalesPage = () => {
  const isShoppingListopen = useStore((s) => s.isShoppingListopen);
  const handleShoppingList = useStore((s) => s.handleShoppingList);
  const shoppingList = useStore((s) => s.shoppingList);
  const { filteredP, setSearch } = useSearch();
  const { productsQuery } = useProducts();

  if (productsQuery.isLoading) return <Loading />;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <TextInput
          onChange={(e) => setSearch(e.target.value)}
          type="search"
          placeholder="Buscar...."
          className="w-full"
          sizing="lg"
        />

        <Button
          onClick={handleShoppingList}
          className="rounded-lg relative"
          color="yellow"
          size="xl"
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
