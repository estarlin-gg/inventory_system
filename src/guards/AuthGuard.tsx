import { useAuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { credentials } = useAuthContext();

  if (!credentials) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};
