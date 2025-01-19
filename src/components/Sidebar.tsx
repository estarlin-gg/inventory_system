import { useState } from "react";
import { CgCloseO } from "react-icons/cg";
import { LuMenu } from "react-icons/lu";
import { NavLink } from "react-router-dom";

const menuItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Sales", href: "/sales" },
  { label: "Invoice", href: "/invoices" },
  { label: "Products", href: "/products" },
  { label: "Logout", href: "/logout" },
];

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="flex md:flex-row lg:h-screen ">
      <nav className="bg-white shadow p-4 w-full md:hidden">
        <div className="flex justify-between items-center">
          <button onClick={toggleSidebar} className="">
            <LuMenu size={30} />
          </button>
          <h1 className="text-lg font-bold text-white">My App</h1>
        </div>
      </nav>

      <div
        className={`bg-blue-500 md:relative md:w-64 ${
          isOpen ? "absolute left-0 top-0 w-64 h-screen z-30" : "hidden"
        } md:block`}
      >
        <div className="md:hidden p-4 flex justify-end">
          <button
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-gray-600"
          >
            <CgCloseO size={24} />
          </button>
        </div>

        <nav className="mt-8">
          <ul className="menu">
            {menuItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.href}
                  className="flex items-center px-4 py-2 text-white hover:bg-slate-300"
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};
