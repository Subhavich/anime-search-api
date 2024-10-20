import { createContext, useState, ReactNode, FC } from "react";
import { CartoonType } from "../types";
import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";

// Define the type for the context value
export interface ModalContextType {
  selectedAnime: CartoonType | undefined;
  setSelectedAnime: React.Dispatch<
    React.SetStateAction<CartoonType | undefined>
  >;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  AnimeDetailModal: FC<{
    cartoon: CartoonType;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
  }>;
}

// Create the context with a default value
export const ModalContext = createContext<ModalContextType | undefined>(
  undefined
);

// Define the props for the provider component
interface ModalContextProviderProps {
  children: ReactNode;
}

// Create the provider component
const UserContextProvider: React.FC<ModalContextProviderProps> = ({
  children,
}) => {
  const [selectedAnime, setSelectedAnime] = useState<CartoonType | undefined>(
    undefined
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const modalValue: ModalContextType = {
    selectedAnime,
    setSelectedAnime,
    isOpen,
    setIsOpen,
    AnimeDetailModal,
  };

  return (
    <ModalContext.Provider value={modalValue}>{children}</ModalContext.Provider>
  );
};

const AnimeDetailModal: FC<{
  cartoon: CartoonType;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}> = ({ cartoon, isOpen, setIsOpen }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
        >
          <motion.div
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
          >
            <FiAlertCircle className="text-white/10 rotate-12 text-[250px] absolute z-0 -top-24 -left-24" />
            <div className="relative z-10">
              <div className="bg-white w-16 h-16 mb-2 rounded-full text-3xl text-indigo-600 grid place-items-center mx-auto">
                <FiAlertCircle />
              </div>
              <h3 className="text-3xl font-bold text-center mb-2">
                {cartoon.title}
              </h3>
              <p className="text-center mb-6">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Id
                aperiam vitae, sapiente ducimus eveniet in velit.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-transparent hover:bg-white/10 transition-colors text-white font-semibold w-full py-2 rounded"
                >
                  Nah, go back
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-white hover:opacity-90 transition-opacity text-indigo-600 font-semibold w-full py-2 rounded"
                >
                  Understood!
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserContextProvider;
