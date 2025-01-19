import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";

export const MainLayout = () => {
  const pathName = useLocation();
  return (
    <main className="flex flex-col md:flex-row h-screen overflow-hidden">
      <div className="w-full md:w-64">
        <Sidebar />
      </div>
      <section className="flex-1 space-y-2 h-screen   bg-gray-100">
        <div className="space-y-2 p-4">
          <div className="border-b-2 p-1">
            <h2 className="text-3xl font-bold capitalize">
              {pathName.pathname.slice(1)}
            </h2>
          </div>
          <Outlet />
        </div>
      </section>
    </main>
  );
};
