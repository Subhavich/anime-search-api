import { createContext, useState, useEffect, ReactNode } from "react";
import { CardType } from "../types";

// Define the type for the context value
export interface UserContextType {
  clearAllData: () => void;
  savedAnime: CardType[];
  setSavedAnime: React.Dispatch<React.SetStateAction<CardType[]>>;
}

// Create the context with a default value
export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

// Define the props for the provider component
interface UserContextProviderProps {
  children: ReactNode;
}

// Create the provider component
const UserContextProvider: React.FC<UserContextProviderProps> = ({
  children,
}) => {
  const [savedAnime, setSavedAnime] = useState<CardType[]>(() => {
    // Load saved data from localStorage on initial render
    const savedData = localStorage.getItem("savedAnime");
    return savedData ? JSON.parse(savedData) : [];
  });

  const clearAllData = () => {
    setSavedAnime([]);
  };

  useEffect(() => {
    // Save data to localStorage whenever savedAnime changes
    localStorage.setItem("savedAnime", JSON.stringify(savedAnime));
  }, [savedAnime]);

  const userValue = {
    savedAnime,
    setSavedAnime,
    clearAllData,
  };

  return (
    <UserContext.Provider value={userValue}>{children}</UserContext.Provider>
  );
};

export default UserContextProvider;
