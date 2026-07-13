import { useParams, Link } from "react-router-dom";
import {
  ArrowLeftIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Tabs,
  TabItem,
  TextInput,
} from "flowbite-react";
import { BiSearch } from "react-icons/bi";
import { MdAttachMoney, MdInventory, MdTrendingUp } from "react-icons/md";
import { Stat } from "../components/chart/Stat";
import { Loading } from "../components/ui/Loading";
import { useSupplierQuery, useSupplierProductsQuery } from "../queries/useSupplierQuery";
import { useHistoryQuery } from "../queries/useHistoryQuery";
import { useStore } from "../store/store";
import { formatCurrency } from "../helpers/formatCurrency";
import { useMemo, useState } from "react";

export const SupplierDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const supplierId = Number(id);

  const { suppliersQuery } = useSupplierQuery();
  const { supplierProductsQuery } = useSupplierProductsQuery(supplierId);
  const { historyQuery } = useHistoryQuery();
  const sales = useStore((s) => s.sales);
  const allProducts = useStore((s) => s.products);

  const supplier = suppliersQuery.data?.find((s) => s.supplier_id === supplierId);
  const products = useMemo(() => supplierProductsQuery.data ?? [], [supplierProductsQuery.data]);
  const [search, setSearch] = useState("");

  const allProductCostMap = useMemo(() => {
    const map = new Map<number, number>();
    allProducts.forEach((p) => map.set(p.product_id, p.cost));
    return map;
  }, [allProducts]);

  const supplierSales = useMemo(() => {
    return sales.filter((sale) =>
      sale.sale_products.some((sp) =>
        products.some((p) => p.product_id === sp.product_id)
      )
    );
  }, [sales, products]);

  const stats = useMemo(() => {
    let totalInvestment = 0;
    let totalRevenue = 0;

    const supplierProductIds = new Set(products.map((p) => p.product_id));

    supplierSales.forEach((sale) => {
      sale.sale_products.forEach((sp) => {
        if (supplierProductIds.has(sp.product_id)) {
          const saleCost = sp.cost ?? 0;
          const currentCost = allProductCostMap.get(sp.product_id) ?? 0;
          const effectiveCost = saleCost > 0 ? saleCost : currentCost;
          totalInvestment += effectiveCost * sp.quantity;
          totalRevenue += sp.price * sp.quantity;
        }
      });
    });

    return {
      totalInvestment,
      totalRevenue,
      totalProfit: totalRevenue - totalInvestment,
    };
  }, [supplierSales, products, allProductCostMap]);

  const productStats = useMemo(() => {
    const map: Record<
      number,
      { name: string; cost: number; price: number; units: number; totalRevenue: number; totalCost: number }
    > = {};

    const supplierProductIds = new Set(products.map((p) => p.product_id));

    supplierSales.forEach((sale) => {
      sale.sale_products.forEach((sp) => {
        if (supplierProductIds.has(sp.product_id)) {
          if (!map[sp.product_id]) {
            const currentCost = allProductCostMap.get(sp.product_id) ?? 0;
            map[sp.product_id] = {
              name: sp.product_name,
              cost: currentCost,
              price: sp.price,
              units: 0,
              totalRevenue: 0,
              totalCost: 0,
            };
          }
          const saleCost = sp.cost ?? 0;
          const currentCost = allProductCostMap.get(sp.product_id) ?? 0;
          const effectiveCost = saleCost > 0 ? saleCost : currentCost;
          map[sp.product_id].units += sp.quantity;
          map[sp.product_id].totalRevenue += sp.price * sp.quantity;
          map[sp.product_id].totalCost += effectiveCost * sp.quantity;
        }
      });
    });

    return Object.entries(map).map(([productId, data]) => ({
      id: Number(productId),
      ...data,
      profit: data.totalRevenue - data.totalCost,
    }));
  }, [supplierSales, products, allProductCostMap]);

  const filteredProducts = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return products;
    return products.filter((p) => p.product_name.toLowerCase().includes(q));
  }, [products, search]);

  const filteredProductStats = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return productStats;
    return productStats.filter((p) => p.name.toLowerCase().includes(q));
  }, [productStats, search]);

  if (suppliersQuery.isLoading || supplierProductsQuery.isLoading || historyQuery.isLoading) {
    return <Loading />;
  }

  if (!supplier) {
    return (
      <section>
        <Link to="../">
          <ArrowLeftIcon className="text-3xl" />
        </Link>
        <p className="text-center text-gray-500 dark:text-gray-400 mt-10">
          Proveedor no encontrado
        </p>
      </section>
    );
  }

  return (
    <section>
      <Link to="../">
        <ArrowLeftIcon className="text-3xl" />
      </Link>

      <div className="border-b border-gray-300 py-2 mt-2">
        <h2 className="text-3xl font-medium">{supplier.name}</h2>
        {supplier.phone && (
          <p className="text-gray-500 dark:text-gray-400">Tel: {supplier.phone}</p>
        )}
        {supplier.email && (
          <p className="text-gray-500 dark:text-gray-400">Email: {supplier.email}</p>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Stat
          title="Inversión total"
          data={formatCurrency(stats.totalInvestment)}
          icon={MdAttachMoney}
        />
        <Stat
          title="Ingresos totales"
          data={formatCurrency(stats.totalRevenue)}
          icon={MdInventory}
        />
        <Stat
          title="Ganancia"
          data={formatCurrency(stats.totalProfit)}
          icon={MdTrendingUp}
        />
      </div>

      <div className="mt-4 flex flex-col md:flex-row gap-3">
        <div className="max-w-md w-full">
          <TextInput
            sizing="md"
            type="search"
            icon={BiSearch}
            placeholder="Buscar producto..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Tabs aria-label="Tabs" variant="underline" className="mt-1 border-none">
        <TabItem title="Productos">
          <div className="mt-4">
            {filteredProducts.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-10">
                {search ? "No se encontraron productos" : "Este proveedor no tiene productos asociados"}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table striped>
                  <TableHead>
                    <TableRow className="bg-gray-100 dark:bg-gray-900">
                      <TableHeadCell className="dark:text-gray-100">Producto</TableHeadCell>
                      <TableHeadCell className="dark:text-gray-100">Costo</TableHeadCell>
                      <TableHeadCell className="dark:text-gray-100">Precio venta</TableHeadCell>
                      <TableHeadCell className="dark:text-gray-100">Stock</TableHeadCell>
                    </TableRow>
                  </TableHead>
                  <TableBody className="divide-y">
                    {filteredProducts.map((p) => (
                      <TableRow key={p.product_id} className="bg-white dark:bg-gray-800">
                        <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                          {p.product_name}
                        </TableCell>
                        <TableCell className="dark:text-gray-300">{formatCurrency(p.cost)}</TableCell>
                        <TableCell className="dark:text-gray-300">{formatCurrency(p.final_price)}</TableCell>
                        <TableCell className="dark:text-gray-300">{p.stock}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </TabItem>

        <TabItem title="Análisis">
          <div className="mt-4">
            {filteredProductStats.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-10">
                {search ? "No se encontraron productos" : "No hay datos de ventas para este proveedor"}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table striped>
                  <TableHead>
                    <TableRow className="bg-gray-100 dark:bg-gray-900">
                      <TableHeadCell className="dark:text-gray-100">Producto</TableHeadCell>
                      <TableHeadCell className="dark:text-gray-100">Unidades vendidas</TableHeadCell>
                      <TableHeadCell className="dark:text-gray-100">Inversión</TableHeadCell>
                      <TableHeadCell className="dark:text-gray-100">Ingresos</TableHeadCell>
                      <TableHeadCell className="dark:text-gray-100">Ganancia</TableHeadCell>
                    </TableRow>
                  </TableHead>
                  <TableBody className="divide-y">
                    {filteredProductStats.map((p) => (
                      <TableRow key={p.id} className="bg-white dark:bg-gray-800">
                        <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                          {p.name}
                        </TableCell>
                        <TableCell className="dark:text-gray-300">{p.units}</TableCell>
                        <TableCell className="dark:text-gray-300">{formatCurrency(p.totalCost)}</TableCell>
                        <TableCell className="dark:text-gray-300">{formatCurrency(p.totalRevenue)}</TableCell>
                        <TableCell
                          className={`font-medium ${
                            p.profit >= 0
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {formatCurrency(p.profit)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </TabItem>
      </Tabs>
    </section>
  );
};
