import { motion, AnimatePresence } from "framer-motion";
import { FC, useContext, useEffect, useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiMaximize2,
  FiPlus,
} from "react-icons/fi";
import useMeasure from "react-use-measure";
import { CartoonType } from "../types";
import { UserContext, UserContextType } from "../store/user-context";
import { fetchAnimeById } from "../http";
import { ModalContext, ModalContextType } from "../store/modal-context";

// Carousel Config
const CARD_WIDTH = 240;
const CARD_HEIGHT = 360;
const MARGIN = 24;
const CARD_SIZE = CARD_WIDTH + MARGIN;

const BREAKPOINTS = {
  sm: 640,
  lg: 1024,
};

// Carousel Components
const CardCarousel: FC<{
  cartoons: CartoonType[];
  runningNumber: number;
  isFetching: boolean;
}> = ({ cartoons, runningNumber, isFetching }) => {
  const [ref, { width }] = useMeasure();
  const [offset, setOffset] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const CARD_BUFFER =
    width > BREAKPOINTS.lg ? 4 : width > BREAKPOINTS.sm ? 2 : 1;

  const CAN_SHIFT_LEFT = offset < 0;

  const CAN_SHIFT_RIGHT =
    Math.abs(offset) < CARD_SIZE * (cartoons.length - CARD_BUFFER);

  const shiftLeft = () => {
    if (!CAN_SHIFT_LEFT) {
      return;
    }
    setOffset((pv) => (pv += CARD_SIZE));
    setSelectedIndex((pv) => pv - 1);
  };

  const shiftRight = () => {
    if (!CAN_SHIFT_RIGHT) {
      return;
    }
    setOffset((pv) => (pv -= CARD_SIZE));
    setSelectedIndex((pv) => pv + 1);
  };

  const moveToCard = (index: number) => {
    const newOffset = -index * CARD_SIZE;
    setOffset(newOffset);
  };
  const reset = () => {
    setOffset(0);
  };

  useEffect(() => {
    setTimeout(() => {
      reset();
      setSelectedIndex(0);
    }, 500);
  }, [runningNumber]);

  return (
    <AnimatePresence>
      <section className="min-h-96 py-8" ref={ref}>
        {isFetching && (
          <p className="pt-32 w-full text-center text-2xl font-semibold text-neutral-500 animate-bounce mx-auto max-w-6xl">
            Loading ...
          </p>
        )}
        {!isFetching && (
          <motion.div
            className="relative overflow-hidden p-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* CARDS */}

            <div className="mx-auto max-w-6xl">
              <motion.div
                animate={{
                  x: offset,
                }}
                className="flex"
              >
                {cartoons.map((cartoon, ind) => (
                  <motion.div
                    key={cartoon.mal_id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 1 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{
                      duration: 0.5,
                      ease: "easeOut",
                      delay: ind * 0.1,
                    }}
                  >
                    <Card
                      selects={selectedIndex === ind}
                      cartoon={cartoon}
                      onClick={() => {
                        setSelectedIndex(ind);
                        moveToCard(ind);
                      }}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* BUTTONS */}
            <>
              <motion.button
                initial={false}
                animate={{
                  x: CAN_SHIFT_LEFT ? "0%" : "-100%",
                }}
                className="absolute left-0 top-[60%] z-30 rounded-r-xl bg-slate-100/30 p-3 pl-2 text-4xl text-white backdrop-blur-sm transition-[padding] hover:pl-3"
                onClick={shiftLeft}
              >
                <FiChevronLeft />
              </motion.button>
              <motion.button
                initial={false}
                animate={{
                  x: CAN_SHIFT_RIGHT ? "0%" : "100%",
                }}
                className="absolute right-0 top-[60%] z-30 rounded-l-xl bg-slate-100/30 p-3 pr-2 text-4xl text-white backdrop-blur-sm transition-[padding] hover:pr-3"
                onClick={shiftRight}
              >
                <FiChevronRight />
              </motion.button>
            </>
          </motion.div>
        )}
      </section>
    </AnimatePresence>
  );
};
interface CardProps {
  onClick: () => void;
  selects: boolean;
  cartoon: CartoonType;
}

const Card = ({ onClick, selects, cartoon }: CardProps) => {
  const userData: UserContextType | undefined = useContext(UserContext);
  if (!userData) return;
  const { images, title, score, year, mal_id } = cartoon;
  const { setSavedAnime, savedAnime } = userData;
  const handleFetchAndSave = async (id: number) => {
    const find = savedAnime.find((anime: CartoonType) => anime.mal_id === id);
    if (find) {
      return;
    }
    const data = await fetchAnimeById(id);
    setSavedAnime((pv: CartoonType[]) => [
      ...pv,
      { ...data, column: "toWatch", id: data.mal_id },
    ]);
  };

  const modalData: ModalContextType | undefined = useContext(ModalContext);
  if (!modalData) return;
  const { setSelectedAnime, isOpen, setIsOpen, AnimeDetailModal } = modalData;

  return (
    <>
      {/* Card */}
      <div
        className="relative shrink-0 break-words cursor-pointer rounded-2xl border border-neutral-500 bg-black shadow-md transition-all hover:scale-[1.05] hover:shadow-xl"
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          marginRight: MARGIN,
          backgroundImage: `url(${images.webp.image_url})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          transform: selects ? "scale(1.08)" : undefined,
        }}
        onClick={onClick}
      >
        <div className="absolute flex flex-col inset-0 z-20 rounded-2xl bg-black opacity-80 p-6 text-white transition-[backdrop-filter]">
          <span className="text-xs font-semibold uppercase text-neutral-300">
            {year}
          </span>
          <p className="my-2 text-2xl font-bold">{title}</p>
          <p className="text-lg text-slate-300">{score}</p>
        </div>
      </div>
      {/* Button */}
      {selects && (
        <div className="mt-8 flex justify-end px-6 space-x-4 hover:cursor-pointer">
          <div
            className="  hover:animate-bounce"
            onClick={() => {
              setSelectedAnime({ ...cartoon });
              setIsOpen(true);
            }}
          >
            <FiMaximize2 className="size-10" />
          </div>
          <div
            onClick={() => handleFetchAndSave(mal_id)}
            className="hover:animate-bounce"
          >
            <FiPlus className="size-10" />
          </div>
          <AnimeDetailModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            cartoon={cartoon}
          />
        </div>
      )}
    </>
  );
};

export default CardCarousel;
