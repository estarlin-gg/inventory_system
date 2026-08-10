import { useState } from "react";
import { AnalyticsSelect } from "../AnalyticsSelect";
import { useSupplierAnalytics } from "../../../hooks/useSupplierAnalytics";
import { MdInventory, MdTrendingUp, MdStorage } from "react-icons/md";
import { Stat } from "../../chart/Stat";
import { Mode, Period } from "../../../models/analytic";
import { formatCurrency } from "../../../helpers/formatCurrency";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Button,
} from "flowbite-react";
import { BiShow } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

export const SupplierAnalyticsTab = () => {
  const [period, setPeriod] = useState<Period>("year");
  const [mode, setMode] = useState<Mode>("period");
  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [range, setRange] = useState<{ startDate: Date; endDate: Date }>();
  const navigate = useNavigate();

  const {
    supplierAnalytics,
    totalInventoryInvestment,
    totalRevenue,
    totalProfit,
  } = useSupplierAnalytics(period, mode, { month, year, range });

  return (
    <>
      <div className="flex justify-end">
        <AnalyticsSelect
          period={period}
          onPeriodChange={setPeriod}
          mode={mode}
          onModeChange={setMode}
          month={month}
          year={year}
          onMonthChange={setMonth}
          onYearChange={setYear}
          onRangeChange={setRange}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Stat
          title="Inversión en inventario"
          data={formatCurrency(totalInventoryInvestment)}
          icon={MdStorage}
        />
        <Stat
          title="Ingresos totales"
          data={formatCurrency(totalRevenue)}
          icon={MdInventory}
        />
        <Stat
          title="Ganancia"
          data={formatCurrency(totalProfit)}
          icon={MdTrendingUp}
        />
      </div>

      <div className="mt-4 overflow-x-auto">
        {supplierAnalytics.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-10">
            No hay datos de compras a proveedores para mostrar
          </p>
        ) : (
          <Table striped>
            <TableHead>
              <TableRow className="bg-gray-100 dark:bg-gray-900">
                <TableHeadCell className="dark:text-gray-100">Proveedor</TableHeadCell>
                <TableHeadCell className="dark:text-gray-100">Productos</TableHeadCell>
                <TableHeadCell className="dark:text-gray-100">Stock total</TableHeadCell>
                <TableHeadCell className="dark:text-gray-100">Inversión inventario</TableHeadCell>
                <TableHeadCell className="dark:text-gray-100">Unidades vendidas</TableHeadCell>
                <TableHeadCell className="dark:text-gray-100">Ingresos ventas</TableHeadCell>
                <TableHeadCell className="dark:text-gray-100">Ganancia ventas</TableHeadCell>
                <TableHeadCell className="dark:text-gray-100"></TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              {supplierAnalytics.map((s) => (
                <TableRow key={s.supplier_id} className="bg-white dark:bg-gray-800">
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-gray-100">
                    {s.supplier_name}
                  </TableCell>
                  <TableCell className="dark:text-gray-300">
                    {s.productsBought}
                  </TableCell>
                  <TableCell className="dark:text-gray-300">
                    {s.totalStock}
                  </TableCell>
                  <TableCell className="dark:text-gray-300">
                    {formatCurrency(s.inventoryInvestment)}
                  </TableCell>
                  <TableCell className="dark:text-gray-300">
                    {s.totalUnits}
                  </TableCell>
                  <TableCell className="dark:text-gray-300">
                    {formatCurrency(s.totalRevenue)}
                  </TableCell>
                  <TableCell
                    className={`font-medium ${
                      s.profit >= 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {formatCurrency(s.profit)}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="xs"
                      color="gray"
                      onClick={() => navigate(`/suppliers/${s.supplier_id}`)}
                    >
                      <BiShow className="mr-1" /> Ver análisis
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
};
