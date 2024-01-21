import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { Alert } from "./alert";
import { FetchApiType } from "../types/commonTypes";

export class FetchApi {
  private static async callApi<T>(
    url: string,
    method: string,
    data: object = {},
    config: AxiosRequestConfig = {},
  ) {
    if (config?.headers?.Authorization) {
      config["headers"]["Authorization"] =
        `Bearer ${config["headers"]["Authorization"]}`;
    }

    try {
      const res = await axios({
        url: url,
        method: method,
        data: data,
        ...config,
      });

      if (res.status < 200 || res.status >= 300) {
        return {
          status: res.status,
          message: res.data?.message,
        };
      }
      return {
        status: res.status,
        ...res.data,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        return {
          status: error.response?.status,
          message: error.response?.data?.message,
        };
      } else if (typeof error === "string") {
        return {
          status: 400,
          message: error,
        };
      } else if (error instanceof Error) {
        return {
          status: 400,
          message: error.message,
        };
      }
      console.log(error);
    }
  }

  static async get<T>(
    url: string,
    data: Record<string, string> = {},
    config: AxiosRequestConfig = {},
  ) {
    const searchStr = new URLSearchParams(data).toString();
    url = url + "?" + searchStr;
    return await this.callApi(url, "get", {}, config);
  }

  static async post<T>(
    url: string,
    data: object = {},
    config: AxiosRequestConfig = {},
  ) {
    return await this.callApi(url, "post", data, config);
  }
}
