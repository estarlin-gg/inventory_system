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
  Button,
  Select,
} from "flowbite-react";
import { BiSearch, BiPlus, BiTrash } from "react-icons/bi";
import { MdAttachMoney, MdStorage, MdDelete, MdTrendingUp } from "react-icons/md";
import { Stat } from "../components/chart/Stat";
import { Loading } from "../components/ui/Loading";
import { useSupplierQuery, useSupplierProductsQuery } from "../queries/useSupplierQuery";
import { useInvestmentQuery } from "../queries/useInvestmentQuery";
import { useProductQuery } from "../queries/useProductQuery";
import { InvestmentForm } from "../components/suppliers/InvestmentForm";
import { formatCurrency } from "../helpers/formatCurrency";
import { useStore } from "../store/store";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { productService } from "../services/productService";
import { queryClient } from "../queries/queryClient";

export const SupplierDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const supplierId = Number(id);

  const { suppliersQuery } = useSupplierQuery();
  const { supplierProductsQuery } = useSupplierProductsQuery(supplierId);
  const { investmentsQuery, deleteInvestmentMutation } = useInvestmentQuery(supplierId);
  const { productsQuery } = useProductQuery();
  const sales = useStore((s) => s.sales);
  const setLoading = useStore((s) => s.setLoading);

  const supplier = suppliersQuery.data?.find((s) => s.supplier_id === supplierId);
  const products = useMemo(() => supplierProductsQuery.data ?? [], [supplierProductsQuery.data]);
  const investments = useMemo(() => investmentsQuery.data ?? [], [investmentsQuery.data]);
  const allProducts = useMemo(() => productsQuery.data ?? [], [productsQuery.data]);
  const [search, setSearch] = useState("");
  const [addProductId, setAddProductId] = useState<number | "">("");

  const availableProducts = useMemo(() => {
    const linkedIds = new Set(products.map((p) => p.product_id));
    return allProducts.filter((p) => !linkedIds.has(p.product_id));
  }, [allProducts, products]);

  const inventoryValue = useMemo(
    () => products.reduce((sum, p) => sum + p.cost * p.stock, 0),
    [products]
  );

  const totalInvested = useMemo(
    () => investments.reduce((sum, inv) => sum + inv.total_cost, 0),
    [investments]
  );

  const filteredProducts = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return products;
    return products.filter((p) => p.product_name.toLowerCase().includes(q));
  }, [products, search]);

  const supplierProductIds = useMemo(() => new Set(products.map((p) => p.product_id)), [products]);

  const supplierSales = useMemo(() => {
    return sales.filter((sale) =>
      sale.sale_products.some((sp) => supplierProductIds.has(sp.product_id))
    );
  }, [sales, supplierProductIds]);

  const allProductCostMap = useMemo(() => {
    const map = new Map<number, number>();
    allProducts.forEach((p) => map.set(p.product_id, p.cost));
    return map;
  }, [allProducts]);

  const stats = useMemo(() => {
    let totalInvestment = 0;
    let totalRevenue = 0;

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
  }, [supplierSales, supplierProductIds, allProductCostMap]);

  const productStats = useMemo(() => {
    const map: Record<
      number,
      { name: string; cost: number; price: number; units: number; totalRevenue: number; totalCost: number }
    > = {};

    supplierSales.forEach((sale) => {
      sale.sale_products.forEach((sp) => {
        if (supplierProductIds.has(sp.product_id)) {
          if (!map[sp.product_id]) {
            map[sp.product_id] = {
              name: sp.product_name,
              cost: allProductCostMap.get(sp.product_id) ?? 0,
              price: sp.price,
              units: 0,
              totalRevenue: 0,
              totalCost: 0,
            };
          }
          const entry = map[sp.product_id];
          const saleCost = sp.cost ?? 0;
          const effectiveCost = saleCost > 0 ? saleCost : (allProductCostMap.get(sp.product_id) ?? 0);
          entry.units += sp.quantity;
          entry.totalRevenue += sp.price * sp.quantity;
          entry.totalCost += effectiveCost * sp.quantity;
        }
      });
    });

    return Object.entries(map).map(([productId, data]) => ({
      id: Number(productId),
      ...data,
      profit: data.totalRevenue - data.totalCost,
    }));
  }, [supplierSales, supplierProductIds, allProductCostMap]);

  const filteredProductStats = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return productStats;
    return productStats.filter((p) => p.name.toLowerCase().includes(q));
  }, [productStats, search]);

  const handleAddProduct = async () => {
    if (!addProductId) return;
    setLoading(true);
    try {
      await productService.addProductToSupplier(Number(addProductId), supplierId);
      await queryClient.invalidateQueries({ queryKey: ["supplierProducts", supplierId] });
      await queryClient.refetchQueries({ queryKey: ["supplierProducts", supplierId] });
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      setAddProductId("");
      toast.success("Producto agregado al proveedor");
    } catch {
      toast.error("Error al agregar producto");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProduct = (productId: number, productName: string) => {
    Swal.fire({
      title: `¿Quitar "${productName}" de este proveedor?`,
      text: "El producto no se elimina, solo se desvincula.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, quitar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        try {
          await productService.removeProductFromSupplier(productId, supplierId);
          await queryClient.invalidateQueries({ queryKey: ["supplierProducts", supplierId] });
          await queryClient.refetchQueries({ queryKey: ["supplierProducts", supplierId] });
          await queryClient.invalidateQueries({ queryKey: ["products"] });
          toast.success("Producto removido del proveedor");
        } catch {
          toast.error("Error al remover producto");
        } finally {
          setLoading(false);
        }
      }
    });
  };

  if (suppliersQuery.isLoading || supplierProductsQuery.isLoading) {
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
        <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
          {supplier.phone && <span>Tel: {supplier.phone}</span>}
          {supplier.email && <span>Email: {supplier.email}</span>}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat
          title="Invertido (inventario)"
          data={formatCurrency(inventoryValue)}
          icon={MdStorage}
        />
        <Stat
          title="Invertido (historial)"
          data={formatCurrency(totalInvested)}
          icon={MdAttachMoney}
        />
        <Stat
          title="Ingresos (ventas)"
          data={formatCurrency(stats.totalRevenue)}
          icon={MdTrendingUp}
        />
        <Stat
          title="Ganancia (ventas)"
          data={formatCurrency(stats.totalProfit)}
          icon={MdTrendingUp}
        />
      </div>

      <Tabs aria-label="Supplier tabs" variant="underline" className="mt-6 border-none">
        <TabItem title={`Productos (${products.length})`}>
          <div className="mt-4">
            <TextInput
              sizing="md"
              type="search"
              icon={BiSearch}
              placeholder="Buscar producto..."
              className="max-w-md"
              onChange={(e) => setSearch(e.target.value)}
            />

            {filteredProducts.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-10">
                {search ? "No se encontraron productos" : "Este proveedor no tiene productos vinculados."}
              </p>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <Table striped>
                  <TableHead>
                    <TableRow className="bg-gray-100 dark:bg-gray-900">
                      <TableHeadCell className="dark:text-gray-100">Producto</TableHeadCell>
                      <TableHeadCell className="dark:text-gray-100">Costo</TableHeadCell>
                      <TableHeadCell className="dark:text-gray-100">Precio venta</TableHeadCell>
                      <TableHeadCell className="dark:text-gray-100">Stock</TableHeadCell>
                      <TableHeadCell className="dark:text-gray-100">Inversión</TableHeadCell>
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
                        <TableCell className="dark:text-gray-300 font-medium">
                          {formatCurrency(p.cost * p.stock)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </TabItem>

        <TabItem title="Análisis de ventas">
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

        <TabItem title={`Inversiones (${investments.length})`}>
          <div className="mt-4">
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Vincular productos al proveedor</h3>
              <div className="flex gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Select
                  className="flex-1"
                  value={addProductId}
                  onChange={(e) => {
                    const val = e.target.value;
                    setAddProductId(val === "" ? "" : Number(val));
                  }}
                >
                  <option value="">Seleccionar producto para vincular...</option>
                  {availableProducts.map((p) => (
                    <option key={p.product_id} value={p.product_id}>
                      {p.product_name}
                    </option>
                  ))}
                </Select>
                <Button
                  color="green"
                  size="sm"
                  onClick={handleAddProduct}
                  disabled={!addProductId}
                >
                  <BiPlus size={16} className="mr-1" /> Vincular
                </Button>
              </div>
              {products.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {products.map((p) => (
                    <span
                      key={p.product_id}
                      className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full"
                    >
                      {p.product_name}
                      <button
                        onClick={() => handleRemoveProduct(p.product_id, p.product_name)}
                        className="text-red-500 hover:text-red-700 ml-1"
                      >
                        <BiTrash size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <InvestmentForm supplierId={supplierId} />

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Registro de inversiones</h3>

              {investments.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-10">
                  No hay inversiones registradas para este proveedor
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table striped>
                    <TableHead>
                      <TableRow className="bg-gray-100 dark:bg-gray-900">
                        <TableHeadCell className="dark:text-gray-100">Fecha</TableHeadCell>
                        <TableHeadCell className="dark:text-gray-100">Producto</TableHeadCell>
                        <TableHeadCell className="dark:text-gray-100">Cantidad</TableHeadCell>
                        <TableHeadCell className="dark:text-gray-100">Costo unit.</TableHeadCell>
                        <TableHeadCell className="dark:text-gray-100">Total</TableHeadCell>
                        <TableHeadCell className="dark:text-gray-100">Nota</TableHeadCell>
                        <TableHeadCell className="dark:text-gray-100"></TableHeadCell>
                      </TableRow>
                    </TableHead>
                    <TableBody className="divide-y">
                      {investments.map((inv) => (
                        <TableRow key={inv.id} className="bg-white dark:bg-gray-800">
                          <TableCell className="dark:text-gray-300 whitespace-nowrap">
                            {format(new Date(inv.created_at), "dd MMM yyyy HH:mm", { locale: es })}
                          </TableCell>
                          <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                            {inv.product_name}
                          </TableCell>
                          <TableCell className="dark:text-gray-300">{inv.quantity}</TableCell>
                          <TableCell className="dark:text-gray-300">
                            {formatCurrency(inv.unit_cost)}
                          </TableCell>
                          <TableCell className="dark:text-gray-300 font-medium">
                            {formatCurrency(inv.total_cost)}
                          </TableCell>
                          <TableCell className="dark:text-gray-400 text-sm max-w-[150px] truncate">
                            {inv.note || "-"}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="xs"
                              color="red"
                              onClick={() => {
                                Swal.fire({
                                  title: "Eliminar inversión?",
                                  icon: "warning",
                                  showCancelButton: true,
                                  confirmButtonText: "Sí, eliminar",
                                  cancelButtonText: "Cancelar",
                                }).then((result) => {
                                  if (result.isConfirmed) {
                                    setLoading(true);
                                    deleteInvestmentMutation.mutate(inv.id, {
                                      onSettled: () => setLoading(false),
                                      onSuccess: () => Swal.fire("Eliminado", "", "success"),
                                    });
                                  }
                                });
                              }}
                            >
                              <MdDelete size={14} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg flex justify-end">
                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Total invertido: {formatCurrency(totalInvested)}
                </span>
              </div>
            </div>
          </div>
        </TabItem>
      </Tabs>
    </section>
  );
};
