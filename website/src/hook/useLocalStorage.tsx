import { useState } from "react";
import { getStorage } from "../Utility/utility";
import { LocalStorageValue } from "../types/commonTypes";

const useLocalStorage = (key: string, defaultValue: LocalStorageValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    return getStorage(key, defaultValue);
  });

  const setValue = (newValue: LocalStorageValue) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {}
    setStoredValue(newValue);
  };

  return [storedValue, setValue];
};

export default useLocalStorage;
