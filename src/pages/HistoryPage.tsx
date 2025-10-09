import { Datepicker, TextInput } from "flowbite-react";
import { BiSearch } from "react-icons/bi";

import { useStore } from "../store/store";
import { SalesTable } from "../components/SaleTable";

import { useFilter } from "../hooks/useFilter";
import { useHistoryQuery } from "../queries/useHistoryQuery";
import { Loading } from "../components/Loading";

export const HistoryPage = () => {
  const sales = useStore((state) => state.sales);
  const { setDate, setQuery, filteredData } = useFilter(sales);
  const { historyQuery } = useHistoryQuery();

  if (historyQuery.isLoading) {
    return <Loading />;
  }

  return (
    <section>
      <div className="border-b border-gray-300 py-2 ">
        <h2 className="text-3xl font-medium">Historial de ventas</h2>
      </div>
      <div className="mt-2 flex gap-4 flex-col">
        <h2 className="text-xl">Filtros de busqueda:</h2>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="max-w-md">
            <TextInput
              type="search"
              icon={BiSearch}
              placeholder="Busca por ID, cliente.."
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Datepicker onChange={(e) => setDate(e)} maxDate={new Date()} />
        </div>
      </div>
      <div className="mt-8">
        <SalesTable sales={filteredData} showId={true} showButtons="both" />
      </div>
    </section>
  );
};
