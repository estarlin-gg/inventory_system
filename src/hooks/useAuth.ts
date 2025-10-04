import { useNavigate } from "react-router-dom";
import { useStore } from "../store/store";
import { LoginCredentials, Credentials } from "../models/auth";

export const useAuth = () => {
  const { authResponse, login, register, logout } = useStore();
  const navigate = useNavigate();

  const handleLogin = (credentials: LoginCredentials) => {
    login(credentials).then(() => {
      navigate("/dashboard");
    });
  };

  const handleRegister = (credentials: Credentials) => {
    register(credentials).then(() => {
      // navigate("/dashboard");
    });
  };

  const handleLogout = () => {
    logout();

    navigate("/login");
  };

  return {
    authResponse,
    isAuthenticated: !!authResponse,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };
};
