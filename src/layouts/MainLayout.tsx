import { Outlet } from "react-router-dom";
import { SideBar } from "../components/ui/SideBar";

export const MainLayout = () => {
  return (
    <main className=" flex-col lg:w-screen !flex lg:flex-row h-screen overflow-hidden bg-white text-gray-900 dark:bg-slate-900 dark:text-gray-100">
    {/* <main className=" flex-col lg:w-screen !flex lg:flex-row h-screen overflow-hidden bg-white text-gray-900 dark:bg-slate-900 dark:text-gray-100"> */}
      {/* <main className=" flex-col lg:w-full flex lg:flex-row dark:bg-slate-900 dark:text-white   h-screen overflow-hidden"> */}
      <SideBar />
      <section className="p-4 w-full overflow-y-auto ">
        <Outlet />
      </section>
    </main>
  );
};
