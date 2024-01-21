import { Navigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth";
import { root } from "./routePath";
import { FC, PropsWithChildren, ReactNode } from "react";
import { AuthValue } from "../types/commonTypes";

const ProtectedRoute: FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to={root} />;
  }

  if (!children) return <></>;

  return <>{children}</>;
};
export default ProtectedRoute;
