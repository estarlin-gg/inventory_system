import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import App from './App.tsx'
import { RouterProvider } from "react-router-dom";
import { routes } from "./routes/routes.tsx";
import { theme, ThemeProvider } from "flowbite-react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <RouterProvider router={routes} />
    </ThemeProvider>

    {/* <App /> */}
  </StrictMode>
);
