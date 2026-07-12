import { useState } from "react";
import { TextInput, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import { BiSearch } from "react-icons/bi";
import { MdAttachMoney, MdInventory, MdTrendingUp } from "react-icons/md";
import { AnalyticsSelect } from "../components/analytics/AnalyticsSelect";
import { Stat } from "../components/chart/Stat";
import { useFinancialAnalytics } from "../hooks/useFinancialAnalytics";
import { useHistoryQuery } from "../queries/useHistoryQuery";
import { Loading } from "../components/ui/Loading";
import { formatCurrency } from "../helpers/formatCurrency";
import { Mode, Period } from "../models/analytic";
import { useMemo } from "react";

export const FinancialPage = () => {
  const [period, setPeriod] = useState<Period>("year");
  const [mode, setMode] = useState<Mode>("period");
  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [range, setRange] = useState<{ startDate: Date; endDate: Date }>();
  const [search, setSearch] = useState("");

  const { historyQuery } = useHistoryQuery();
  const {
    productFinancials,
    totalInvestment,
    totalRevenue,
    totalProfit,
  } = useFinancialAnalytics(period, mode, { month, year, range });

  const filteredProducts = useMemo(() => {
    return productFinancials.filter((p) =>
      p.product_name.toLowerCase().includes(search.toLowerCase())
    );
  }, [productFinancials, search]);

  if (historyQuery.isLoading) return <Loading />;

  return (
    <section>
      <div className="border-b border-gray-300 py-2">
        <h2 className="text-3xl font-medium">Análisis financiero</h2>
      </div>

      <div className="flex justify-end mt-4">
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
          title="Inversión total"
          data={formatCurrency(totalInvestment)}
          icon={MdAttachMoney}
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

      <div className="mt-4 overflow-x-auto">
        {filteredProducts.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-10">
            No hay datos financieros para mostrar
          </p>
        ) : (
          <Table striped>
            <TableHead>
              <TableRow className="bg-gray-100 dark:bg-gray-900">
                <TableHeadCell className="dark:text-gray-100">Producto</TableHeadCell>
                <TableHeadCell className="dark:text-gray-100">Costo unit.</TableHeadCell>
                <TableHeadCell className="dark:text-gray-100">Precio venta</TableHeadCell>
                <TableHeadCell className="dark:text-gray-100">Unidades</TableHeadCell>
                <TableHeadCell className="dark:text-gray-100">Inversión</TableHeadCell>
                <TableHeadCell className="dark:text-gray-100">Ingresos</TableHeadCell>
                <TableHeadCell className="dark:text-gray-100">Ganancia</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              {filteredProducts.map((p) => (
                <TableRow key={p.id} className="bg-white dark:bg-gray-800">
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
                    {p.units}
                  </TableCell>
                  <TableCell className="dark:text-gray-300">
                    {formatCurrency(p.totalCost)}
                  </TableCell>
                  <TableCell className="dark:text-gray-300">
                    {formatCurrency(p.totalRevenue)}
                  </TableCell>
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
        )}
      </div>
    </section>
  );
};
