import { Stat } from "../components/chart/Stat";
import { MdAttachMoney, MdInventory, MdPointOfSale } from "react-icons/md";
import { Link } from "react-router-dom";
import { Button } from "flowbite-react";
import { SalesTable } from "../components/sales/SaleTable";
import { formatCurrency } from "../helpers/formatCurrency";
import { useHistoryQuery } from "../queries/useHistoryQuery";
import { Loading } from "../components/ui/Loading";
import { useAnalytics } from "../hooks/useAnalytics";

export const HomePage = () => {
  const { totalIncome, totalSales, totalStock, salesOfTheDay } =
    useAnalytics("day");
  const { historyQuery } = useHistoryQuery();
  if (historyQuery.isLoading) {
    return <Loading />;
  }

  return (
    <section>
      <div className="border-b border-gray-300 py-2 ">
        <h2 className="text-3xl font-medium">Dashboard de negocio</h2>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4">
        <Stat
          title="ingresos del día"
          data={formatCurrency(totalIncome)}
          icon={MdAttachMoney}
        />
        <Stat title="stocks vendidos" data={totalStock} icon={MdInventory} />
        <Stat title="ventas del día" data={totalSales} icon={MdPointOfSale} />
      </div>

      <div className="w-full ">
        <div className=" flex justify-between items-center py-4">
          <h2 className="text-2xl font-medium my-4">Ventas recientes</h2>
          <Link to={"/history"}>
            <Button color={"alternative"}>Ver todas</Button>
          </Link>
        </div>
        <SalesTable sales={salesOfTheDay} />
      </div>
    </section>
  );
};
