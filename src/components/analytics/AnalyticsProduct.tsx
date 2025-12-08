import { Avatar, Card } from "flowbite-react";
import { formatCurrency } from "../../helpers/formatCurrency";
import { ProductAnalytics } from "../../models/analytic";
import AnalyticsPieChart from "../chart/PieChart";

interface Props {
  products: ProductAnalytics[];
}

export const AnalyticsProduct = ({ products = [] }: Props) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-stretch">
      <Card className="lg:col-span-2 h-full flex flex-col">
        <div className="border-b pb-1 border-gray-300">
          <h2 className="font-semibold text-lg">Top Productos más vendidos</h2>
        </div>

        <div className="flex-1 gap-4 flex flex-col ">
          {products.length === 0 && (
            <div className="p-4 text-center text-gray-400">
              No hay datos disponibles
            </div>
          )}

          {products.map((p) => (
            <div key={p.id} className="p-2 flex justify-between items-center border-b-1 border-gray-300  last:border-b-0 ">
              <div className="flex items-center gap-4">
                <Avatar rounded size="sm" img={p.image ?? undefined} />
                <div className="flex flex-col">
                  <span>{p.product_name}</span>
                  <span className="text-xs dark:text-gray-400">
                    {p.units} unidades
                  </span>
                </div>
              </div>

              <div>
                <span>{formatCurrency(p.total)}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="lg:col-span-3 h-full flex flex-col">
        <div className="border-b pb-1 border-gray-300">
          <h2 className="font-semibold text-lg">Distribución de ventas</h2>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <AnalyticsPieChart
            data={products.map((p) => ({
              name: p.product_name,
              value: p.units,
            }))}
          />
        </div>
      </Card>
    </div>
  );
};
