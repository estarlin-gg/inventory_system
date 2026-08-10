import { Navigate, Outlet } from "react-router-dom";
import { useStore } from "../store/store";
import { Loading } from "../components/ui/Loading";

export const ProtectedRoute = () => {
  const authResponse = useStore((state) => state.authResponse);
  const authChecked = useStore((state) => state.authChecked);

  if (!authChecked) return <Loading />;

  if (!authResponse) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
