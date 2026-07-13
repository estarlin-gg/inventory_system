import { TabItem, Tabs } from "flowbite-react";
import { GeneralAnalyticsTab } from "../components/analytics/tabs/GeneralAnalyticsTab ";
import { ProductAnalyticsTab } from "../components/analytics/tabs/ProductAnalyticsTab ";
import { SupplierAnalyticsTab } from "../components/analytics/tabs/SupplierAnalyticsTab";

export const AnalyticsPage = () => {
  return (
    <section>
      <div className="border-b border-gray-300 py-2 flex flex-col lg:flex-row gap-2 justify-between">
        <h2 className="text-3xl font-medium">Análisis de ventas</h2>
      </div>
      <Tabs aria-label="Tabs" variant="underline" className="mt-1 border-none">
        <TabItem title="Analisis general">
          <GeneralAnalyticsTab />
        </TabItem>
        <TabItem title="Analisis de Productos">
          <ProductAnalyticsTab />
        </TabItem>
        <TabItem title="Analisis de Proveedores">
          <SupplierAnalyticsTab />
        </TabItem>
      </Tabs>
    </section>
  );
};
