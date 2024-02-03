import {
  Await,
  Navigate,
  Outlet,
  useAsyncError,
  useLoaderData,
  useOutletContext,
} from "react-router-dom";
import { useAuth } from "../hook/useAuth";
import { root } from "../Utility/routePath";
import { Suspense, useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { Alert } from "./Alerts/alert";
import { User } from "../types/commonTypes";

type ContextType = { users: Record<string, any> };

const Protectedayout = () => {
  const { user } = useAuth();
  const { usersPromise } = useLoaderData() as {
    usersPromise: Promise<Record<string, any>>;
  };

  if (!user) {
    return <Navigate to={root} />;
  }

  return (
    <Suspense
      fallback={
        <Box
          sx={{
            height: "100vh",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress size={60} />
        </Box>
      }
    >
      <Await
        resolve={usersPromise}
        errorElement={<Redirecting />}
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

const Redirecting = () => {
  const { logout } = useAuth();

  const error = useAsyncError() as { message?: string };

  useEffect(() => {
    Alert.error(error?.message);
    logout();
  }, []);

  return <Typography>Redirecting...</Typography>;
};
