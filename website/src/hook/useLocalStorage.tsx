import { useState } from "react";
import { getStorage } from "../Utility/utility";

const useLocalStorage = (key: string, defaultValue?: string | null) => {
  const [storedValue, setStoredValue] = useState(() => {
    return getStorage(key, defaultValue);
  });

  const setValue = (newValue: string) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {}
    setStoredValue(newValue);
  };

  return [storedValue, setValue];
};

export default useLocalStorage;
