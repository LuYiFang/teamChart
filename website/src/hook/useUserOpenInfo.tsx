import { FC, ReactNode, createContext, useContext, useState } from "react";
import { UserOpenInfoProps } from "../types/commonTypes";
import useLocalStorage from "./useLocalStorage";

const UserOpenInfoContext = createContext<UserOpenInfoProps>({
  userOpenInfo: { name: "" },
  setUserOpenInfo: (userInfo) => {},
});

export const UserOpenInfoProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [userOpenInfo, setUserOpenInfo] = useLocalStorage("userOpenInfo", {
    name: "",
  });

  return (
    <UserOpenInfoContext.Provider value={{ userOpenInfo, setUserOpenInfo }}>
      {children}
    </UserOpenInfoContext.Provider>
  );
};

export const useUserOpenInfo = () => {
  return useContext(UserOpenInfoContext);
};
