import { Spinner } from "flowbite-react";

export const Loading = () => {
  return (
    <div className="h-full w-full flex justify-center items-center overflow-hidden bg-white dark:bg-gray-900">
      <div className="flex justify-center items-center min-w-screen min-h-screen">
        <Spinner size="xl" />
      </div>
    </div>
  );
};
