import { createContext, useState, ReactNode } from "react";
import { CartoonType } from "../types";
// Define the type for the context value
interface UserContextType {
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
  const [savedAnime, setSavedAnime] = useState<CartoonType[]>([]);
  const userValue = {
    savedAnime,
    setSavedAnime,
    name: "KIMI",
  };

  return (
    <UserContext.Provider value={userValue}>{children}</UserContext.Provider>
  );
};

export default UserContextProvider;
