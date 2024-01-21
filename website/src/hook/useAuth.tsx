import React, {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "./useLocalStorage";
import { home, root } from "../Utility/routePath";
import { AuthValue } from "../types/commonTypes";

const AuthContext = createContext<AuthValue>({
  user: "",
  login: (data: string) => Promise<{}>,
  logout: () => Promise<{}>,
});

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useLocalStorage("user", null);
  const navigate = useNavigate();

  const login = async (data: string) => {
    setUser(data);
    console.log("nav");
    navigate(home);
  };

  const logout = async () => {
    setUser(null);
    navigate(root, { replace: true });
  };

  const value = useMemo<AuthValue>(() => {
    return { user, login, logout };
  }, [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
