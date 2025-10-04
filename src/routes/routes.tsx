import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import { RegisterPage } from "../pages/RegisterPage";
import { LoginPage } from "../pages/LoginPage";
import { MainLayout } from "../layouts/MainLayout";
import { HomePage } from "../pages/HomePage";
import { InventoryPage } from "../pages/InventoryPage";
import { ProductForm } from "../components/ProductForm";
import { SalesPage } from "../pages/SalesPage";
import { HistoryPage } from "../pages/HistoryPage";
import { AnalyticsPage } from "../pages/AnalyticsPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { BlockAuthRoute } from "./BlockAuthRoute";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <BlockAuthRoute />,
        children: [
          { path: "login", element: <LoginPage /> },
          { path: "register", element: <RegisterPage /> },
          { path: "*", element: <Navigate to="/login" replace /> },
        ],
      },

      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <MainLayout />,
            children: [
              { index: true, element: <Navigate to="/home" replace /> },

              { path: "home", element: <HomePage /> },
              {
                path: "inventory",
                children: [
                  { index: true, element: <InventoryPage /> },
                  { path: "create", element: <ProductForm /> },
                  { path: ":id", element: <ProductForm /> },
                ],
              },
              { path: "history", element: <HistoryPage /> },
              { path: "analytics", element: <AnalyticsPage /> },
              { path: "sales", element: <SalesPage /> },

              { path: "*", element: <Navigate to="/home" replace /> },
            ],
          },
        ],
      },

      { index: true, element: <Navigate to="/login" replace /> },
      { path: "*", element: <Navigate to="/login" replace /> },
    ],
  },
]);
