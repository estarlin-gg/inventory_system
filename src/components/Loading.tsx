import { Spinner } from "flowbite-react";

export const Loading = () => {
  return (
    <div className="min-h-screen fixed z-50 min-w-screen overflow-hidden flex justify-center items-center  bg-white dark:bg-gray-900">
      <div className="flex justify-center items-center w-screen h-full">
        <Spinner size="xl" />
      </div>
    </div>
  );
};
