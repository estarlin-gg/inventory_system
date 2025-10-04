import { Outlet } from "react-router-dom";
import { useStore } from "./store/store";
import { Loading } from "./components/Loading";

import { useAuthListener } from "./hooks/useAuthListener";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./queries/queryClient";
// import { isTokenExpired } from "./lib/token";

function App() {
  const loading = useStore((state) => state.isLoading);

  useAuthListener();

  return (
    <QueryClientProvider client={queryClient}>
      
      {loading ? <Loading /> : <Outlet />}
    </QueryClientProvider>
  );
}

export default App;
