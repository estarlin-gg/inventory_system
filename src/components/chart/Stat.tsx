import { ElementType } from "react";

interface StatProps {
  title: string;
  subtitle?: string;
  icon: ElementType;
  data: string | number;
}

export const Stat = ({ title, subtitle, icon: Icon, data }: StatProps) => {
  return (
    <div className="shadow-lg border border-gray-200 dark:border-gray-700 rounded-lg p-6 flex items-center justify-between bg-white dark:bg-gray-800">
      <div className="flex flex-col gap-2">
        <h2 className="text-md font-medium text-gray-600 dark:text-gray-300 capitalize">
          {title}
        </h2>
        <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{data}</span>
        {subtitle && (
          <p className="text-gray-600 dark:text-gray-300 font-medium capitalize">{subtitle}</p>
        )}
      </div>
      <div className="text-green-600 dark:text-green-400">
        <Icon size={45} />
      </div>
    </div>
  );
};
