import { useNavigate } from "react-router-dom";
import { useStore } from "../store/store";
import { LoginCredentials, Credentials } from "../models/auth";
import { login, logout, register } from "../services/authService";

export const useAuth = () => {
  const authResponse = useStore((s) => s.authResponse);
  const setAuthResponse = useStore((s) => s.setAuthResponse);
  const setLoading = useStore((s) => s.setLoading);
  const navigate = useNavigate();

  const handleLogin = async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      const { user } = await login(credentials);

      if (!user) {
        throw new Error("No se pudo iniciar sesión");
      }

      setAuthResponse(user);
      navigate("/home");
    } catch (err) {
      console.error(err);
      // aquí puedes opcionalmente guardar el error en el slice
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (credentials: Credentials) => {
    await register(credentials);
  };

  const handleLogout = async () => {
    await logout();
    setAuthResponse(null);
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
