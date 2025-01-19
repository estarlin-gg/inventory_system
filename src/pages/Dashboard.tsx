
import { SalesGraph } from "../components/SalesGraph";
import { Stat } from "../components/Stat";
import { TopProducts } from "../components/TopProducts";

export const Dashboard = () => {

  return (
    <div className="space-y-4">
      <div className=" grid grid-cols-1 gap-4 lg:grid-cols-4 ">
        <Stat classes="w-full" />
        <Stat classes="w-full " />
        <Stat classes="w-full " />
      </div>
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
        <div className=" rounded-2xl border px-4 bg-white space-y-2">
          <div className="card-title p-2">
            <h2>Sales of the week</h2>
          </div>
          <div className="">
            <SalesGraph />
          </div>
        </div>
        <div className="">
          <TopProducts />
        </div>
      </div>
    </div>
  );
};
