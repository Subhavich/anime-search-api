import { createContext, useState, useEffect, ReactNode } from "react";
import { CartoonType } from "../types";

// Define the type for the context value
export interface UserContextType {
  savedAnime: CartoonType[];
  setSavedAnime: React.Dispatch<React.SetStateAction<CartoonType[]>>;
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
  const [savedAnime, setSavedAnime] = useState<CartoonType[]>(() => {
    // Load saved data from localStorage on initial render
    const savedData = localStorage.getItem("savedAnime");
    return savedData ? JSON.parse(savedData) : [];
  });

  useEffect(() => {
    // Save data to localStorage whenever savedAnime changes
    localStorage.setItem("savedAnime", JSON.stringify(savedAnime));
  }, [savedAnime]);

  const userValue = {
    savedAnime,
    setSavedAnime,
  };

  return (
    <UserContext.Provider value={userValue}>{children}</UserContext.Provider>
  );
};

export default UserContextProvider;
