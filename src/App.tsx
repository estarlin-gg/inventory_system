import { Outlet } from "react-router-dom";
import { useStore } from "./store/store";
import { Loading } from "./components/ui/Loading";
import { useAuthListener } from "./hooks/useAuthListener";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./queries/queryClient";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeInitializer } from "./hooks/ThemeInitializer";
import { ToastContainer } from "react-toastify";
import { useThemeMode } from "flowbite-react";
import { useEffect } from "react";
import { syncService } from "./services/offline";
import { isElectron } from "./utils/platform";

function App() {
  const loading = useStore((state) => state.isLoading);
  const { computedMode } = useThemeMode();

  useAuthListener();

  useEffect(() => {
    if (isElectron) {
      syncService.start();
      return () => syncService.stop();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <ThemeInitializer />
      {loading && <Loading />}
      <Outlet />
      <ToastContainer theme={computedMode}  />
    </QueryClientProvider>
  );
}

export default App;
