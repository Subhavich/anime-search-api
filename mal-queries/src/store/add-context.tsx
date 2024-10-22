// store/user-context.tsx
import {
  createContext,
  useState,
  FC,
  ReactNode,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";
import { Portal } from "./modal-context";

// Step 1: Define the type for the context value
export interface AddContextType {
  background: boolean;
  setBackground: Dispatch<SetStateAction<boolean>>; // Correct setter type
  adding: boolean;
  setAdding: Dispatch<SetStateAction<boolean>>; // Correct setter type
  StatusModal: FC<StatusProps>;
}

// Step 3: Create the context
export const AddContext = createContext<AddContextType | undefined>(undefined);

// Step 4: Create the context provider component
export const AddContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [background, setBackground] = useState(false);
  const [adding, setAdding] = useState(false);
  return (
    <AddContext.Provider
      value={{
        background,
        setBackground,
        adding,
        setAdding,
        StatusModal,
      }}
    >
      {children}
    </AddContext.Provider>
  );
};

// Define the props for StatusModal
interface StatusProps {
  message: string;
}

export const StatusModal: FC<StatusProps> = ({ message }) => {
  const addData = useContext(AddContext);
  if (!addData) return null;

  const { adding } = addData;

  return (
    <Portal>
      {adding && (
        <div className="text-5xl text-white bg-transparent fixed top-1/2 left-1/2 shadow-lg">
          {message}
        </div>
      )}
    </Portal>
  );
};

export default AddContextProvider;
