import {
  Sidebar,
  SidebarCollapse,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
  SunIcon,
  MoonIcon,
  useThemeMode,
  Avatar,
} from "flowbite-react";
import { HiChartPie, HiShoppingBag, HiMenu, HiX } from "react-icons/hi";
import { useState } from "react";
import { SidebarLink } from "./SidebarLink";
import { BiLogOut, BiMoney } from "react-icons/bi";
import { HiTruck } from "react-icons/hi";
import { useAuth } from "../../hooks/useAuth";
import { useStore } from "../../store/store";

export const SideBar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Header móvil */}
      <div className="bg-slate-200 dark:bg-slate-800 p-4 flex justify-between items-center lg:hidden">
        <span className="text-slate-900 dark:text-white font-bold">
          MimaApp
        </span>
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
            <Sidebar aria-label="Sidebar " className="h-full">
              <SidebarContent />
            </Sidebar>
          </div>
        </div>
      )}
    </>
  );
};

const SidebarContent = () => {
  const { computedMode, toggleMode } = useThemeMode();
  const { logout } = useAuth();
  const userData = useStore((u) => u.authResponse);
 

  return (
    <SidebarItems className="h-full flex flex-col justify-between">
      <SidebarItemGroup>
        <SidebarCollapse icon={HiChartPie} label="Home">
          <SidebarLink title="Dashboard" url="/home" />
          <SidebarLink title="Historial" url="/history" />
          <SidebarLink title="Análisis" url="/analytics" />
          <SidebarLink title="Finanzas" url="/financial" />
        </SidebarCollapse>

        <SidebarLink title="Ventas" url="/sales" icon={BiMoney} />
        <SidebarLink title="Inventario" url="/inventory" icon={HiShoppingBag} />
        <SidebarLink title="Proveedores" url="/suppliers" icon={HiTruck} />
      </SidebarItemGroup>

      <SidebarItemGroup>
        <SidebarItem
          className="px-2 flex items-center cursor-pointer"
          icon={computedMode === "dark" ? MoonIcon : SunIcon}
          onClick={toggleMode}
        >
          <span>{computedMode === "dark" ? "Oscuro" : "Claro"}</span>
        </SidebarItem>
        <SidebarItem className="px-2 cursor-pointer">
          <div className="flex items-center gap-3 w-full  relative -left-4">
            <Avatar rounded size="sm" className="p-0 m-0" />
            <span>{userData?.user_metadata.display_name}</span>
          </div>
        </SidebarItem>

        <SidebarItem
          className="px-2 text-red-600 dark:text-red-600 cursor-pointer mt-2 text flex items-center"
          icon={() => <BiLogOut color="red" size={23} />}
          onClick={() => logout()}
        >
          Log Out
        </SidebarItem>
      </SidebarItemGroup>
    </SidebarItems>
  );
};
