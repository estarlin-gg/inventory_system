/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/store";
import { LoginCredentials, Credentials } from "../models/auth";
import { login, logout, register } from "../services/authService";
import { supabaseError } from "../lib/supabaseError";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { offlineService } from "../services/offline";
import { supabase } from "../lib/supabase";
import { isElectron } from "../utils/platform";

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
      if (isElectron) await offlineService.auth.save(user);
      navigate("/home");
    } catch (err) {
      const e = err as any;
      const error = supabaseError(e);
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (credentials: Credentials): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await register(credentials);

      if (error) throw error;

      await Swal.fire(
        "Verifica tu correo",
        "Te hemos enviado un enlace para confirmar tu cuenta. Revisa tu bandeja de entrada.",
        "success"
      );

      await supabase.auth.signOut();
      return true;
    } catch (err) {
      const e = err as any;
      const error = supabaseError(e);
      toast.error(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setAuthResponse(null);
    if (isElectron) await offlineService.auth.clear();
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
