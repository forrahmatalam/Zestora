import { createContext, useContext } from "react";

export const AppContext = createContext(undefined);

export const useAppData = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppData must be used within AppProvider");
  }
  return context;
};
