import {
  Sidebar,
  SidebarCollapse,
  SidebarItemGroup,
  SidebarItems,
} from "flowbite-react";
import { HiChartPie, HiShoppingBag, HiMenu, HiX } from "react-icons/hi";
import { useState } from "react";
import { SidebarLink } from "./SidebarLink";
import { BiMoney } from "react-icons/bi";

export const SideBar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Header móvil */}
      <div className="bg-slate-200 dark:bg-slate-800 p-4 flex justify-between items-center lg:hidden">
        <span className="text-slate-900 dark:text-white font-bold">MimaApp</span>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="text-slate-900 dark:text-white text-2xl"
        >
          {isMobileOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Sidebar escritorio */}
      <div className="hidden lg:block lg:w-fit">
        <Sidebar aria-label="Sidebar escritorio" className="h-screen">
          <SidebarContent />
        </Sidebar>
      </div>

      {/* Sidebar móvil */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setIsMobileOpen(false)}
          />

          {/* Sidebar */}
          <div className="relative w-64 bg-slate-200 dark:bg-slate-900 shadow-lg z-50">
            <Sidebar aria-label="Sidebar móvil" className="h-full">
              <SidebarContent />
            </Sidebar>
          </div>
        </div>
      )}
    </>
  );
};

const SidebarContent = () => (
  <SidebarItems className="h-full">
    <SidebarItemGroup>
      <SidebarCollapse icon={HiChartPie} label="Home">
        <SidebarLink title="Dashboard" url="/home" />
        <SidebarLink title="Historial" url="/history" />
        <SidebarLink title="Análisis" url="/analytics" />
      </SidebarCollapse>

      <SidebarLink title="Ventas" url="/sales" icon={BiMoney} />
      <SidebarLink title="Inventario" url="/inventory" icon={HiShoppingBag} />
    </SidebarItemGroup>
  </SidebarItems>
);
