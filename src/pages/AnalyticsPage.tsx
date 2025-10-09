import { Select } from "flowbite-react";
import { Stat } from "../components/Stat";

import { MdInventory, MdPointOfSale } from "react-icons/md";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import AnalyticsChart from "../components/LineChart";

export const AnalyticsPage = () => {
  return (
    <section>
      <div className="border-b border-gray-300 py-2 flex flex-col md:flex-row  gap-2 justify-between">
        <h2 className="text-3xl font-medium">Analisis de ventas</h2>
        <Select
          // onChange={(e) => setPeriod(e.target.value as Period)}
          className="md:w-xs "
          id="countries"
          required
        >
          <option value={"day"}>Ventas del dia</option>
          <option value={"week"}>Ventas de la semana</option>
          <option value={"month"}>Ventas del mes</option>
          <option value={"year"}>Ventas del año</option>
        </Select>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat
          title="ingresos total"
          data={`$${4000}`}
          icon={RiMoneyDollarCircleFill}
        />
        <Stat title="stocks vendidos" data={300} icon={MdInventory} />
        <Stat title="total de ventas" data={30} icon={MdPointOfSale} />
        <Stat title="total de ventas" data={30} icon={MdPointOfSale} />
      </div>
      <div className="grid gap-4 mt-8 h-96">
        {/* <LineChartExample data={fullAnalytic} period={period} /> */}
        <AnalyticsChart />
      </div>
    </section>
  );
};
