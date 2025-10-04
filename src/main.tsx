import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import App from './App.tsx'
import { RouterProvider } from "react-router-dom";
import { routes } from "./routes/routes.tsx";
import { ThemeConfig } from "flowbite-react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./queries/queryClient";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <ThemeConfig  mode="auto" />
      {/* <ThemeConfig dark={false} mode="light" /> */}

      <RouterProvider router={routes} />
    </QueryClientProvider>
    {/* <ThemeConfig dark={false} mode="dark" /> */}

    {/* <App /> */}
  </StrictMode>
);
