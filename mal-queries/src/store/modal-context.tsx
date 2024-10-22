import { createContext, useState, ReactNode, FC, Dispatch } from "react";
import { createPortal } from "react-dom";
import { CartoonType, GenreType } from "../types";
import { AnimatePresence, motion } from "framer-motion";
import { FiPlus } from "react-icons/fi";
import { useContext, SetStateAction } from "react";
import { UserContext } from "./user-context";
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
const ModalContextProvider: FC<ModalContextProviderProps> = ({ children }) => {
  const [selectedAnime, setSelectedAnime] = useState<CartoonType | undefined>(
    undefined
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const modalValue: ModalContextType = {
    selectedAnime,
    setSelectedAnime,
    isOpen,
    setIsOpen,
    AnimeDetailModal, // Ensure this is defined or imported
  };

  return (
    <ModalContext.Provider value={modalValue}>{children}</ModalContext.Provider>
  );
};

interface AnimeDetailModalType extends CartoonType {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  cartoon: CartoonType;
  setAdding: Dispatch<SetStateAction<boolean>>;
}

// Modal Component
const AnimeDetailModal: FC<AnimeDetailModalType> = ({
  isOpen,
  setIsOpen,
  cartoon,
  setAdding,
}) => {
  const userData = useContext(UserContext);
  if (!userData) {
    return null; // Handle undefined userData gracefully
  }

  const { setSavedAnime } = userData;
  const modalContext = useContext(ModalContext); // Get the ModalContext
  if (!modalContext) {
    return null; // Handle undefined context gracefully
  }

  const { selectedAnime } = modalContext; // Access selectedAnime from context
  if (!selectedAnime) {
    return null; // Ensure selectedAnime is defined before using it
  }

  const { title, synopsis, trailer, images, genres, score, scored_by, aired } =
    selectedAnime;

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
              className="bg-neutral-900 border border-neutral-500 p-6 rounded-lg w-full max-w-4xl shadow-xl cursor-default relative overflow-hidden"
            >
              <div className="relative z-10 p-4">
                <div className="grid grid-cols-12 min-h-36 gap-4">
                  {/* left */}
                  <div className="col-span-12 sm:col-span-6 overflow-hidden space-y-2 pr-4">
                    <div className="relative">
                      <div className="absolute z-10 bg-gradient-to-t from-neutral-900 to-transparent inset-0"></div>
                      <img
                        className="relative object-cover object-left w-full max-h-32 sm:max-h-96 sm:size-96 z-0"
                        src={images.webp.large_image_url}
                      />
                    </div>
                    <div className="relative pl-8 line-clamp-2 text-4xl font-mono -mt-12 text-white z-50">
                      {title}
                    </div>
                    <div className="relative pl-8 line-clamp-3 sm:line-clamp-4 mb-12">
                      {synopsis}
                    </div>
                  </div>
                  {/* right */}
                  <div className="col-span-12 text-center sm:text-left sm:col-span-6 space-y-1 sm:space-y-4 font-mono">
                    <p className="text-2xl font-bold">TAGS</p>
                    <div className="flex gap-4 flex-wrap sm:justify-start justify-center">
                      {genres.map((genre: GenreType) => (
                        <span className="text-lg" key={genre.name}>
                          {genre.name.toUpperCase()}
                        </span>
                      ))}
                    </div>
                    <p className="text-2xl font-bold">SCORE</p>
                    <div className="flex gap-2 justify-center sm:justify-start">
                      <span>{score}</span>
                      <span>scored by {scored_by} users</span>
                    </div>
                    <p className="text-2xl font-bold">DATE</p>
                    <p>{aired.string}</p>
                    <p className="text-2xl font-bold">TRAILER</p>
                    <div>
                      {trailer.embed_url ? (
                        <iframe
                          src={trailer.embed_url}
                          className="rounded-2xl w-full aspect-video"
                        />
                      ) : (
                        "Trailer Data Not Found"
                      )}
                    </div>
                  </div>
                </div>
                {/* Button Group */}
                <div className="m-4 flex gap-2">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="bg-transparent hover:bg-white/10 transition-colors text-white font-semibold w-full py-2 rounded"
                  >
                    Go back
                  </button>
                  <button
                    onClick={() => {
                      setSavedAnime((pv) => [
                        ...pv,
                        { ...cartoon, column: "toWatch", id: cartoon.mal_id },
                      ]);

                      setIsOpen(false);
                      setAdding(true);
                    }}
                    className="flex items-center gap-1 font-mono justify-center bg-white hover:opacity-90 transition-opacity text-black font-semibold w-full py-2 rounded"
                  >
                    Add <FiPlus className="inline center" />
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

// Export the provider component
export default ModalContextProvider;
