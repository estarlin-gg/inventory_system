import { Navigate, Outlet } from "react-router-dom";
import { useStore } from "../store/store";

export const ProtectedRoute = () => {
  const authResponse = useStore((state) => state.authResponse);

  if (!authResponse) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};
