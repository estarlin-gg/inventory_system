import { createBrowserRouter, Navigate } from "react-router-dom";
import { Login } from "../pages/LoginPage";
import { Register } from "../pages/RegisterPage";
import { Home } from "../pages/Dashboard";
import { AuthGuard } from "../guards/AuthGuard";

export const router = createBrowserRouter([
  {
    path: "/home",
    element: (
      <AuthGuard>
        <Home />
      </AuthGuard>
    ),
  },
  {
    path: "/login", 
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/", 
    element: <Navigate to="/home" />, 
  },
  {
    path: "*", 
    element: <Navigate to="/home" />,
  },
]);
