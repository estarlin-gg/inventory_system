import { Navigate, Outlet } from "react-router-dom";
import { useStore } from "../store/store";
import { Loading } from "../components/ui/Loading";

export const BlockAuthRoute = () => {
  const auth = useStore((state) => state.authResponse);
  const authChecked = useStore((state) => state.authChecked);

  if (!authChecked) return <Loading />;

  if (auth) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};
