import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  TextInput,
} from "flowbite-react";
import { useState, useMemo } from "react";
import { BiSearch } from "react-icons/bi";
import { MdAttachMoney, MdInventory } from "react-icons/md";
import { Stat } from "../../chart/Stat";
import { useNoSupplierAnalytics } from "../../../hooks/useNoSupplierAnalytics";
import { formatCurrency } from "../../../helpers/formatCurrency";

export const NoSupplierAnalyticsTab = () => {
  const { noSupplierProducts, totalInvestment, totalStock, count } =
    useNoSupplierAnalytics();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return noSupplierProducts;
    return noSupplierProducts.filter((p) =>
      p.product_name.toLowerCase().includes(q)
    );
  }, [noSupplierProducts, search]);

  return (
    <div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Stat
          title="Productos sin proveedor"
          data={count}
          icon={MdInventory}
        />
        <Stat
          title="Inversión total"
          data={formatCurrency(totalInvestment)}
          icon={MdAttachMoney}
        />
        <Stat
          title="Stock total"
          data={totalStock}
          icon={MdInventory}
        />
      </div>

      <div className="mt-4">
        <TextInput
          sizing="md"
          type="search"
          icon={BiSearch}
          placeholder="Buscar producto..."
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="mt-4 overflow-x-auto">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-10">
            {noSupplierProducts.length === 0
              ? "Todos los productos tienen proveedor asignado"
              : "No se encontraron productos"}
          </p>
        ) : (
          <Table striped>
            <TableHead>
              <TableRow className="bg-gray-100 dark:bg-gray-900">
                <TableHeadCell className="dark:text-gray-100">
                  Producto
                </TableHeadCell>
                <TableHeadCell className="dark:text-gray-100">
                  Costo unit.
                </TableHeadCell>
                <TableHeadCell className="dark:text-gray-100">
                  Precio venta
                </TableHeadCell>
                <TableHeadCell className="dark:text-gray-100">
                  Stock
                </TableHeadCell>
                <TableHeadCell className="dark:text-gray-100">
                  Inversión
                </TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              {filtered.map((p) => (
                <TableRow key={p.product_id} className="bg-white dark:bg-gray-800">
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-gray-100">
                    {p.product_name}
                  </TableCell>
                  <TableCell className="dark:text-gray-300">
                    {formatCurrency(p.cost)}
                  </TableCell>
                  <TableCell className="dark:text-gray-300">
                    {formatCurrency(p.price)}
                  </TableCell>
                  <TableCell className="dark:text-gray-300">
                    {p.stock}
                  </TableCell>
                  <TableCell className="dark:text-gray-300">
                    {formatCurrency(p.totalInvestment)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};
