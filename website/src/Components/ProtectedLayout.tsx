import {
  Await,
  Navigate,
  Outlet,
  OutletProps,
  useLoaderData,
  useOutlet,
  useOutletContext,
} from "react-router-dom";
import { useAuth } from "../hook/useAuth";
import { home, root } from "../Utility/routePath";
import React, { PropsWithChildren, ReactNode, Suspense } from "react";
import { Alert, LinearProgress } from "@mui/material";

type ContextType = { users: Array<string> };

const Protectedayout = () => {
  const { user } = useAuth();
  const outlet = useOutlet();
  const { usersPromise } = useLoaderData() as {
    usersPromise: Promise<Array<string>>;
  };

  if (!user) {
    return <Navigate to={root} />;
  }

  return (
    <Suspense fallback={<LinearProgress />}>
      <Await
        resolve={usersPromise}
        errorElement={<Alert severity="error">Wrong!!!</Alert>}
        children={(users) => (
          <>
            <Outlet context={{ users }} />
          </>
        )}
      ></Await>
    </Suspense>
  );
};
export default Protectedayout;

export const useUsers = () => {
  return useOutletContext<ContextType>();
};
