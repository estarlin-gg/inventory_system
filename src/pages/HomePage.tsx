import { useStore } from "../store/store";
import { Stat } from "../components/Stat";

import { MdAttachMoney, MdInventory, MdPointOfSale } from "react-icons/md";
import { Link } from "react-router-dom";
import { Button } from "flowbite-react";
import { SalesTable } from "../components/SaleTable";

export const HomePage = () => {
  // const getProducts = useStore((s) => s.getproducts);
  // const getSalesToday = useStore((s) => s.getSalesToday);
  const salesToday = useStore((s) => s.salesToday);

  const totalStock = salesToday.reduce((total, sale) => {
    return (
      total + sale.sale_products.reduce((sum, prod) => sum + prod.quantity, 0)
    );
  }, 0);

  const totalIncome = salesToday.reduce((sum, sale) => sum + sale.total_pay, 0);

  const recentSales = salesToday.slice(0, 9);

  return (
    <section>
      <div className="border-b border-gray-300 py-2 ">
        <h2 className="text-3xl font-medium">Dashboard de negocio</h2>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4">
        <Stat
          title="ingresos del día"
          data={`$${totalIncome}`}
          icon={MdAttachMoney}
        />
        <Stat title="stocks vendidos" data={totalStock} icon={MdInventory} />
        <Stat
          title="ventas del día"
          data={salesToday.length}
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
        <SalesTable sales={recentSales} />
      </div>
    </section>
  );
};
