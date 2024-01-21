import React from "react";
import "./App.css";
import {
  Route,
  createBrowserRouter,
  createRoutesFromChildren,
  defer,
} from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import { home, login, root, signup } from "./Utility/routePath";
import PublicLayout from "./Components/PublicLayout";
import Protectedayout from "./Components/ProtectedLayout";
import AuthLayout from "./Components/AuthLayout";
import { FetchApi } from "./Utility/fetchApi";
import { api } from "./apiConifg";
import SignUp from "./Pages/SignUp";
import { getStorage } from "./Utility/utility";

const getUsers = async (): Promise<Array<string>> => {
  const res = await FetchApi.get(
    api.users,
    {},
    {
      headers: {
        Authorization: getStorage("user", ""),
      },
    },
  );
  if (res.status !== 200) {
    return [];
  }
  return res.users;
};

export const router = createBrowserRouter(
  createRoutesFromChildren(
    <Route element={<AuthLayout />}>
      <Route element={<PublicLayout />}>
        <Route path={root} element={<Login />} />
        <Route path={login} element={<Login />} />
        <Route path={signup} element={<SignUp />} />
      </Route>

      <Route
        element={<Protectedayout />}
        loader={() => defer({ usersPromise: getUsers() })}
      >
        <Route path={home} element={<Home />} />
      </Route>
    </Route>,
  ),
);
