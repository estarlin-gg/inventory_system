import { Navigate, Outlet } from "react-router-dom";
import { useStore } from "../store/store";

export const BlockAuthRoute = () => {
  const auth = useStore((state) => state.authResponse);

  if (auth) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};
