import { LocalStorageValue } from "../types/commonTypes";

export const getStorage = (key: string, defaultValue: LocalStorageValue) => {
  try {
    const value = window.localStorage.getItem(key);
    if (value) {
      return JSON.parse(value);
    }
    window.localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  } catch (error) {
    return defaultValue;
  }
};
