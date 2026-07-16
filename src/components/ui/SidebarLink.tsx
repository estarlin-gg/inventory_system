import { ElementType } from "react";
import { Link, useLocation } from "react-router-dom";

interface SideBarLinkProps {
  url: string;
  title: string;
  icon?: ElementType;
  onClick?: () => void;
}

export const SidebarLink = ({ title, url, icon: Icon, onClick }: SideBarLinkProps) => {
  const location = useLocation();
  const isActive =
    location.pathname === url ||
    location.pathname.startsWith(url + "/");

  return (
    <Link
      to={url}
      onClick={onClick}
      className={`flex items-center rounded-lg py-2 px-2 text-base font-normal group w-full transition duration-75
        ${
          isActive
            ? "bg-blue-100 text-blue-700 font-semibold dark:bg-blue-900 dark:text-blue-400"
            : "text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
        }
      `}
    >
      {Icon && <Icon size={23} />}
      <span
        data-testid="flowbite-sidebar-item-content"
        className="flex-1 whitespace-nowrap px-3"
      >
        {title}
      </span>
    </Link>
  );
};
