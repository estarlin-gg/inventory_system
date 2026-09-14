import { Spinner } from "flowbite-react";

export const Loading = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-gray-900">
      <Spinner size="xl" />
    </div>
  );
};
