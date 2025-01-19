import { useEffect, useState } from "react";
import { IUserCredentials } from "../model";
import { registerUser, loginUser, logoutUser } from "../services/authService";
import { supabase } from "../supabase/supabase";
import { User } from "@supabase/supabase-js";
import { createUserFolder } from "../services/fileServices";

export const useAuth = () => {
  const [credentials, setCredentials] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCredentials(session.user);
        if (session.user.confirmed_at) {
          createUserFolder(session.user.id);
        }
      } else {
        setCredentials(null);
      }
      setLoading(false);
    });
  }, []);

  const Register = async (data: IUserCredentials) => {
    try {
      setLoading(true);
      const user = await registerUser(data);
      console.log("Usuario registrado con éxito:", user);
    } catch (error) {
      console.error("Error al registrar usuario:", error);
    } finally {
      setLoading(false);
    }
  };

  const Login = async (data: IUserCredentials) => {
    try {
      setLoading(true);
      const user = await loginUser(data);
      console.log("Usuario autenticado con éxito:", user);
      setCredentials(user?.user || null);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    } finally {
      setLoading(false);
    }
  };

  const Logout = async () => {
    try {
      setLoading(true);
      await logoutUser();
      setCredentials(null);
      console.log("Usuario desconectado.");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    credentials,
    loading,
    Register,
    Login,
    Logout,
    setLoading,
  };
};
