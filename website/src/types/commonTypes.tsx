import { AxiosRequestConfig } from "axios";

export type User = {
  id: string;
  name: string;
  group: string;
};

export type findUser = string | undefined | null;

export type AuthValue = {
  user: string;
  login: (data: string) => void;
  logout: () => void;
};

export interface FetchApiType {
  url: string;
  method: string;
  data?: Object;
  config?: AxiosRequestConfig;
}

export interface UserOpenInfo {
  name: string;
}

export interface UserOpenInfoProps {
  userOpenInfo: UserOpenInfo;
  setUserOpenInfo: (userInfo: UserOpenInfo) => void;
}

export interface Message {
  username: string;
  message: string;
  groupId: string;
  createTime: Date;
}

export interface MessageGroup {
  [groupId: string]: Message[];
}

export type LocalStorageValue = string | UserOpenInfo | null;
