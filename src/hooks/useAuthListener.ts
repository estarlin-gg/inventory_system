import { useEffect } from "react";
import { useStore } from "../store/store";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { offlineService } from "../services/offline";
import { isElectron } from "../utils/platform";

export const useAuthListener = () => {
  const setAuthResponse = useStore((state) => state.setAuthResponse);
  const setAuthChecked = useStore((state) => state.setAuthChecked);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (cancelled) return;

      if (event === "INITIAL_SESSION") {
        if (session?.user) {
          setAuthResponse(session.user);
          if (isElectron) offlineService.auth.save(session.user);
        } else if (isElectron) {
          const cached = await offlineService.auth.get();
          if (cached && !cancelled) {
            setAuthResponse(cached as Parameters<typeof setAuthResponse>[0]);
          } else if (!cancelled) {
            navigate("/login");
          }
        }
        if (!cancelled) setAuthChecked(true);
      } else if (event === "SIGNED_IN" && session?.user) {
        setAuthResponse(session.user);
        if (isElectron) offlineService.auth.save(session.user);
      } else if (event === "SIGNED_OUT") {
        setAuthResponse(null);
        if (isElectron) offlineService.auth.clear();
        navigate("/login");
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [setAuthResponse, setAuthChecked, navigate]);
};
