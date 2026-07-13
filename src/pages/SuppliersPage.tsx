import { useMemo, useState } from "react";
import { Button, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";
import { BiEdit, BiPlus, BiSearch, BiShow, BiTrash } from "react-icons/bi";
import { useSupplierActions } from "../actions/supplier-actions";
import { Loading } from "../components/ui/Loading";
import { useSupplierQuery } from "../queries/useSupplierQuery";
import { useStore } from "../store/store";

export const SuppliersPage = () => {
  const { suppliersQuery, handleDeleteSupplier } = useSupplierActions();
  const { suppliersQuery: allSuppliers } = useSupplierQuery();
  const products = useStore((s) => s.products);
  const [search, setSearch] = useState("");

  const suppliersWithProducts = useMemo(() => {
    const suppliers = allSuppliers.data ?? [];
    const lowerSearch = search.toLowerCase();

    return suppliers
      .map((supplier) => {
        const supplierProducts = products.filter(
          (p) => p.supplier_id === supplier.supplier_id
        );
        return { ...supplier, productCount: supplierProducts.length };
      })
      .filter((s) => {
        if (!lowerSearch) return true;
        return (
          s.name.toLowerCase().includes(lowerSearch) ||
          (s.email ?? "").toLowerCase().includes(lowerSearch) ||
          (s.phone ?? "").toLowerCase().includes(lowerSearch)
        );
      });
  }, [allSuppliers.data, products, search]);

  if (suppliersQuery.isLoading) return <Loading />;

  return (
    <section>
      <div className="border-b border-gray-300 py-2 flex justify-between items-center">
        <h2 className="text-3xl font-medium">Proveedores</h2>
        <Link to="create">
          <Button color="blue" size="sm">
            <BiPlus size={18} className="mr-1" />
            Nuevo proveedor
          </Button>
        </Link>
      </div>

      <div className="mt-4 flex flex-col md:flex-row gap-3">
        <div className="max-w-md w-full">
          <TextInput
            sizing="md"
            type="search"
            icon={BiSearch}
            placeholder="Buscar proveedor..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        {suppliersWithProducts.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center mt-10">
            {search ? "No se encontraron proveedores" : "No hay proveedores registrados"}
          </p>
        ) : (
          <Table striped>
            <TableHead>
              <TableRow className="bg-gray-100 dark:bg-gray-900">
                <TableHeadCell className="dark:text-gray-100">Nombre</TableHeadCell>
                <TableHeadCell className="dark:text-gray-100">Teléfono</TableHeadCell>
                <TableHeadCell className="dark:text-gray-100">Email</TableHeadCell>
                <TableHeadCell className="dark:text-gray-100">Dirección</TableHeadCell>
                <TableHeadCell className="dark:text-gray-100">Productos</TableHeadCell>
                <TableHeadCell className="dark:text-gray-100">
                  <span className="sr-only">Acciones</span>
                </TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              {suppliersWithProducts.map((supplier) => (
                <TableRow key={supplier.supplier_id} className="bg-white dark:bg-gray-800">
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-gray-100">
                    {supplier.name}
                  </TableCell>
                  <TableCell className="dark:text-gray-300">
                    {supplier.phone || "-"}
                  </TableCell>
                  <TableCell className="dark:text-gray-300">
                    {supplier.email || "-"}
                  </TableCell>
                  <TableCell className="dark:text-gray-300">
                    {supplier.address || "-"}
                  </TableCell>
                  <TableCell className="dark:text-gray-300">
                    {supplier.productCount}
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Link to={`${supplier.supplier_id}`}>
                      <Button size="xs" color="blue">
                        <BiShow size={16} />
                      </Button>
                    </Link>
                    <Link to={`${supplier.supplier_id}/edit`}>
                      <Button size="xs" color="yellow">
                        <BiEdit size={16} />
                      </Button>
                    </Link>
                    <Button
                      size="xs"
                      color="red"
                      onClick={() => handleDeleteSupplier(supplier.supplier_id)}
                    >
                      <BiTrash size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </section>
  );
};
