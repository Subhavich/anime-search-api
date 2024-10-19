import { motion, AnimatePresence } from "framer-motion";
import { FC, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import useMeasure from "react-use-measure";
import { CartoonType } from "../types";

const CARD_WIDTH = 240;
const CARD_HEIGHT = 360;
const MARGIN = 24;
const CARD_SIZE = CARD_WIDTH + MARGIN;

const BREAKPOINTS = {
  sm: 640,
  lg: 1024,
};

const CardCarousel: FC<{ cartoons: CartoonType[] }> = ({ cartoons }) => {
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
  };

  const shiftRight = () => {
    if (!CAN_SHIFT_RIGHT) {
      return;
    }
    setOffset((pv) => (pv -= CARD_SIZE));
  };

  const moveToCard = (index: number) => {
    const newOffset = -index * CARD_SIZE;
    setOffset(newOffset);
  };

  return (
    <AnimatePresence>
      <section className="" ref={ref}>
        <motion.div
          className="relative overflow-hidden p-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* CARDS */}
          <div className="mx-auto max-w-6xl">
            <p className="mb-4 text-2xl font-semibold">
              Everything.{" "}
              <span className="text-slate-500">Yes, even that.</span>
            </p>
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
                    {...cartoon}
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
      </section>
    </AnimatePresence>
  );
};
interface CardProps extends CartoonType {
  onClick: () => void;
}

const Card = ({ images, title, score, year, onClick }: CardProps) => {
  return (
    <div
      className="relative shrink-0 overflow-clip cursor-pointer rounded-2xl border border-neutral-500 bg-black shadow-md transition-all hover:scale-[1.05] hover:shadow-xl"
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        marginRight: MARGIN,
        backgroundImage: `url(${images.webp.image_url})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
      onClick={onClick}
    >
      <div className="absolute  inset-0 z-20 rounded-2xl bg-black opacity-80 p-6 text-white transition-[backdrop-filter]">
        <span className="text-xs font-semibold uppercase text-neutral-300">
          {year}
        </span>
        <p className="my-2 text-3xl font-bold">{title}</p>
        <p className="text-lg text-slate-300">{score}</p>
      </div>
    </div>
  );
};

export default CardCarousel;
