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
import { AnimatePresence, motion } from "framer-motion";

// Step 1: Define the type for the context value
export interface AddContextType {
  message: string;
  setMessage: Dispatch<SetStateAction<string>>; // Correct setter type
  adding: boolean;
  setAdding: Dispatch<SetStateAction<boolean>>; // Correct setter type
  StatusModal: FC<{}>;
}

// Step 3: Create the context
export const AddContext = createContext<AddContextType | undefined>(undefined);

// Step 4: Create the context provider component
export const AddContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [message, setMessage] = useState("");
  const [adding, setAdding] = useState(false);
  return (
    <AddContext.Provider
      value={{
        message,
        setMessage,
        adding,
        setAdding,
        StatusModal,
      }}
    >
      {children}
    </AddContext.Provider>
  );
};

export const StatusModal: FC<{}> = ({}) => {
  const addData = useContext(AddContext);
  if (!addData) return null;

  const { adding, message } = addData;

  return (
    <Portal>
      <AnimatePresence>
        {adding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className=" -translate-x-[50%] z-50 -translate-y-[50%] text-5xl text-white bg-transparent fixed top-1/2 left-1/2 shadow-lg"
          >
            <div className="relative bg-black opacity-65 inset-0">
              {message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
};

export default AddContextProvider;
