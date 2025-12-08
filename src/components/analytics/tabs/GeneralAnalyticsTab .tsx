import { useState } from "react";
import { AnalyticsSelect } from "../AnalyticsSelect";
import { useAnalytics } from "../../../hooks/useAnalytics";
import { formatCurrency } from "../../../helpers/formatCurrency";
import { MdInventory, MdPointOfSale } from "react-icons/md";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import AnalyticsBarChart from "../../chart/BarChart";
import { Stat } from "../../chart/Stat";
import { Mode, Period } from "../../../models/analytic";

export const GeneralAnalyticsTab = () => {
  const [period, setPeriod] = useState<Period>("day");
  const [mode, setMode] = useState<Mode>("period");
  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [range, setRange] = useState<{ startDate: Date; endDate: Date }>();

  const { totalIncome, totalStock, totalSales, groupedData } = useAnalytics(
    period,
    mode,
    { month, year, range }
  );

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
          title="Ingresos totales"
          data={formatCurrency(totalIncome)}
          icon={RiMoneyDollarCircleFill}
        />
        <Stat title="Stock vendido" data={totalStock} icon={MdInventory} />
        <Stat title="Total de ventas" data={totalSales} icon={MdPointOfSale} />
      </div>

      <div className="grid gap-4 mt-8 h-96">
        <AnalyticsBarChart data={groupedData} />
      </div>
    </>
  );
};
