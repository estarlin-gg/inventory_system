import { TabItem, Tabs } from "flowbite-react";
import { GeneralAnalyticsTab } from "../components/analytics/tabs/GeneralAnalyticsTab";
import { ProductAnalyticsTab } from "../components/analytics/tabs/ProductAnalyticsTab";
import { SupplierAnalyticsTab } from "../components/analytics/tabs/SupplierAnalyticsTab";
import { FinancialTab } from "../components/analytics/tabs/FinancialTab";
import { NoSupplierAnalyticsTab } from "../components/analytics/tabs/NoSupplierAnalyticsTab";
import { useProductQuery } from "../queries/useProductQuery";
import { useHistoryQuery } from "../queries/useHistoryQuery";
import { useSupplierQuery } from "../queries/useSupplierQuery";
import { Loading } from "../components/ui/Loading";

export const AnalyticsPage = () => {
  const { productsQuery } = useProductQuery();
  const { historyQuery } = useHistoryQuery();
  const { suppliersQuery } = useSupplierQuery();

  const isLoading = productsQuery.isLoading || historyQuery.isLoading || suppliersQuery.isLoading;

  if (isLoading) return <Loading />;

  return (
    <section>
      <div className="border-b border-gray-300 py-2">
        <h2 className="text-3xl font-medium">Análisis</h2>
      </div>
      <Tabs aria-label="Tabs" variant="underline" className="mt-1 border-none">
        <TabItem title="General">
          <GeneralAnalyticsTab />
        </TabItem>
        <TabItem title="Productos">
          <ProductAnalyticsTab />
        </TabItem>
        <TabItem title="Proveedores">
          <SupplierAnalyticsTab />
        </TabItem>
        <TabItem title="Sin proveedor">
          <NoSupplierAnalyticsTab />
        </TabItem>
        <TabItem title="Finanzas">
          <FinancialTab />
        </TabItem>
      </Tabs>
    </section>
  );
};
