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
