import { FC, useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { FiMaximize2 } from "react-icons/fi";
import { CartoonType } from "../types";
import { useContext } from "react";
import { ModalContext } from "../store/modal-context";

const ROTATION_RANGE = 32.5;
const HALF_ROTATION_RANGE = 32.5 / 2;

const TiltCard: FC<{ cartoon: CartoonType }> = ({ cartoon }) => {
  const { images } = cartoon;

  const modalData = useContext(ModalContext);
  if (!modalData) {
    return null;
  }
  const { setIsOpen, AnimeDetailModal, isOpen, setSelectedAnime } = modalData;

  const ref = useRef<HTMLDivElement>(null);
  const [isMouseTracking, setIsMouseTracking] = useState(true);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x);
  const ySpring = useSpring(y);

  const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseTracking || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = (e.clientX - rect.left) * ROTATION_RANGE;
    const mouseY = (e.clientY - rect.top) * ROTATION_RANGE;

    const rX = (mouseY / height - HALF_ROTATION_RANGE) * -1;
    const rY = mouseX / width - HALF_ROTATION_RANGE;

    x.set(rX);
    y.set(rY);
  };

  const handleMouseLeave = () => {
    if (isMouseTracking) {
      x.set(0);
      y.set(0);
    }
  };

  const handleClick = () => {
    setSelectedAnime({ ...cartoon });
    setIsOpen(true);
    x.set(0);
    y.set(0);
    setIsMouseTracking(false); // Disable mouse tracking when the modal is open
  };

  const handleModalClose = () => {
    setIsOpen(false);
    setIsMouseTracking(true); // Re-enable mouse tracking when the modal is closed
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        transform,
      }}
      className="relative h-96 w-72 rounded-xl bg-neutral-800 "
    >
      <div
        style={{
          backgroundImage: `url(${images.webp.image_url})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          transform: "translateZ(75px)",
          transformStyle: "preserve-3d",
        }}
        className="absolute inset-3 grid place-content-center rounded-xl bg-white shadow-lg"
      >
        <div
          className="inset-4 hover:text-white text-5xl opacity-0 hover:opacity-80 hover:cursor-pointer transition-all hover:animate-pulse z-50"
          onClick={handleClick}
        >
          <FiMaximize2 />
        </div>
        <AnimeDetailModal
          {...cartoon}
          isOpen={isOpen}
          cartoon={cartoon}
          setIsOpen={handleModalClose} // Use handleModalClose to reset mouse tracking when the modal closes
        />
        <div className="p-4 absolute inset-0 bg-black rounded-xl z-10 opacity-60 flex flex-col"></div>
      </div>
    </motion.div>
  );
};

export default TiltCard;
