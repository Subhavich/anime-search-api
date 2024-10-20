import { createContext, useState, ReactNode, FC } from "react";
import { createPortal } from "react-dom";
import { CartoonType } from "../types";
import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";

interface PortalProps {
  children: ReactNode;
}

export const Portal: React.FC<PortalProps> = ({ children }) => {
  const modalRoot = document.getElementById("modal-root");
  return modalRoot ? createPortal(children, modalRoot) : null;
};

// Define the type for the context value
export interface ModalContextType {
  selectedAnime: CartoonType | undefined;
  setSelectedAnime: React.Dispatch<
    React.SetStateAction<CartoonType | undefined>
  >;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  AnimeDetailModal: FC<AnimeDetailModalType>;
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

interface AnimeDetailModalType extends CartoonType {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const AnimeDetailModal: FC<AnimeDetailModalType> = ({
  title,
  isOpen,
  setIsOpen,
  synopsis,
  trailer
}) => {
  console.log(trailer)
  return (
    <AnimatePresence>
      <Portal>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed text-neutral-500 inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur"
          >
            <motion.div
              initial={{ scale: 0, rotate: "12.5deg" }}
              animate={{ scale: 1, rotate: "0deg" }}
              exit={{ scale: 0, rotate: "0deg" }}
              onClick={(e) => e.stopPropagation()}
              className="  bg-gradient-to-br border border-neutral-500 p-6 rounded-lg w-full max-w-5xl  shadow-xl cursor-default relative overflow-hidden"
            >
              <div className="relative z-10">
                <iframe className="w-full aspect-video" src="https://www.youtube.com/embed/oh9y94vvOEQ?si=77F99bHxF7IfDlHr"/>
                <h3 className="text-3xl font-bold text-center mb-2">{title}</h3>
                <p className="text-center mb-6">
                  {synopsis}
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
                    Add to Watch List
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </Portal>
    </AnimatePresence>
  );
};

export default UserContextProvider;
