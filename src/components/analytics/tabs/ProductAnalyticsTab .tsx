import { useState } from "react";
import { AnalyticsSelect } from "../AnalyticsSelect";
import { useAnalytics } from "../../../hooks/useAnalytics";
import { MdAttachMoney, MdInventory } from "react-icons/md";
import { TbChessQueenFilled } from "react-icons/tb";
import { Stat } from "../../chart/Stat";
import { AnalyticsProduct } from "../AnalyticsProduct";
import { Mode, Period } from "../../../models/analytic";
import { formatCurrency } from "../../../helpers/formatCurrency";

export const ProductAnalyticsTab = () => {
  const [period, setPeriod] = useState<Period>("day");
  const [mode, setMode] = useState<Mode>("period");
  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [range, setRange] = useState<{ startDate: Date; endDate: Date }>();

  const {
    totalStock,
    // top5Products,
    productsAnalytics,
    totalIncome,
  } = useAnalytics(period, mode, { month, year, range });

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

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Stat
          title="Producto mas Vendido"
          data={
            productsAnalytics?.[0]?.product_name || "Sin datos de productos"
          }
          icon={TbChessQueenFilled}
        />
        <Stat title="Total de unidades" data={totalStock} icon={MdInventory} />
        <Stat
          title="Ingresos Totales"
          data={formatCurrency(totalIncome)}
          icon={MdAttachMoney}
        />
      </div>

      <div className="mt-4">
        <AnalyticsProduct products={productsAnalytics} />
      </div>
    </>
  );
};
