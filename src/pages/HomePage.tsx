// import { useStore } from "../store/store";
import { Stat } from "../components/Stat";

import { MdAttachMoney, MdInventory, MdPointOfSale } from "react-icons/md";
import { Link } from "react-router-dom";
import { Button } from "flowbite-react";
import { SalesTable } from "../components/SaleTable";
import { useAnalytics } from "../hooks/useAnalytics";
import { formatCurrency } from "../helpers/formatCurrency";
import { useHistoryQuery } from "../queries/useHistoryQuery";
import { Loading } from "../components/Loading";

export const HomePage = () => {
  const { analyticsOfTheDay } = useAnalytics();
  const { historyQuery } = useHistoryQuery();
  if (historyQuery.isLoading) {
    return <Loading />;
  }

  console.log(analyticsOfTheDay);

  return (
    <section>
      <div className="border-b border-gray-300 py-2 ">
        <h2 className="text-3xl font-medium">Dashboard de negocio</h2>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4">
        <Stat
          title="ingresos del día"
          data={formatCurrency(analyticsOfTheDay.incomeOfDay)}
          icon={MdAttachMoney}
        />
        <Stat
          title="stocks vendidos"
          data={analyticsOfTheDay.totalStock}
          icon={MdInventory}
        />
        <Stat
          title="ventas del día"
          data={analyticsOfTheDay.salesOfTheDay.length}
          icon={MdPointOfSale}
        />
      </div>

      <div className="w-full ">
        <div className=" flex justify-between items-center py-4">
          <h2 className="text-2xl font-medium my-4">Ventas recientes</h2>
          <Link to={"/history"}>
            <Button color={"alternative"}>Ver todas</Button>
          </Link>
        </div>
        <SalesTable sales={analyticsOfTheDay.salesOfTheDay} />
      </div>
    </section>
  );
};
