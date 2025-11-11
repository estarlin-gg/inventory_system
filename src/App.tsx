import { Outlet } from "react-router-dom";
import { useStore } from "./store/store";
import { Loading } from "./components/ui/Loading";
import { useAuthListener } from "./hooks/useAuthListener";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./queries/queryClient";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeInitializer } from "./hooks/ThemeInitializer";

function App() {
  const loading = useStore((state) => state.isLoading);

  useAuthListener();
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <ThemeInitializer />
      {/* {loading ? <Loading /> : <Outlet />} */}
      {loading && <Loading />}
      <Outlet />
    </QueryClientProvider>
  );
}

export default App;
