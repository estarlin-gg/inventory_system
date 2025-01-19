import { createContext, ReactNode, useContext } from "react";
import { IAuthContext } from "../model";

import { useAuth } from "../hooks/useAuth";
import { Loading } from "../components/Loading";

const AuthProvider = createContext<IAuthContext>({} as IAuthContext);

export const AuthContext = ({ children }: { children: ReactNode }) => {
  const { credentials, loading } = useAuth();

  return (
    <AuthProvider.Provider value={{ credentials, loading }}>
      {loading ? <Loading /> : children}
    </AuthProvider.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => useContext(AuthProvider);
