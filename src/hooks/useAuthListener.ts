import { useEffect } from "react";
import { useStore } from "../store/store";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export const useAuthListener = () => {
  const setAuthResponse = useStore((state) => state.setAuthResponse);
  const setIsLoading = useStore((state) => state.setLoading);
  const navigate = useNavigate();
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session == null) {
          navigate("/login");
          setIsLoading(false);
          return;
        }
        setAuthResponse(session?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [setAuthResponse, navigate, setIsLoading]);
};
