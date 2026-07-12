// import { useEffect } from "react";
import { Button, TextInput } from "flowbite-react";
import { ProductList } from "../components/products/ProductList";
import { CgAdd } from "react-icons/cg";
import { Link } from "react-router-dom";
import { useSearch } from "../hooks/useSearch";
import { useStore } from "../store/store";
import { useProductQuery } from "../queries/useProductQuery";
import { Loading } from "../components/ui/Loading";

export const InventoryPage = () => {
  // const getProducts = useStore((s) => s.getproducts);
  const setSelectedProduct = useStore((s) => s.setSelectedProduct);
  // const products = useStore((s) => s.products);
  const { filteredP, setSearch } = useSearch();
  const { productsQuery } = useProductQuery();
  
  if (productsQuery.isLoading) return <Loading />;
  // if (productsQuery.isLoading) return <p>Cargando...</p>;
  if (productsQuery.isError) return <p>Error al cargar productos</p>;

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
        <Link to={"create"}>
          <Button
            onClick={() => setSelectedProduct(null)}
            color="green"
            size="md"
          >
            <span>Crear</span>
            <CgAdd size={20} className="mx-2" />
          </Button>
        </Link>
      </div>
      <ProductList data={filteredP} type="edit" emptyMessage="No hay productos en el inventario" />
    </div>
  );
};
