import { FC, useRef } from "react";
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

// backgroundImage: `url(${images.webp.image_url})`,

const ROTATION_RANGE = 32.5;
const HALF_ROTATION_RANGE = 32.5 / 2;

const TiltCard: FC<{ cartoon: CartoonType }> = ({ cartoon }) => {
  const { images, title, score, synopsis } = cartoon;

  const modalData = useContext(ModalContext)
  if(!modalData){return}
  const {setIsOpen,AnimeDetailModal,isOpen} = modalData

  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x);
  const ySpring = useSpring(y);

  const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return [0, 0];

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
    x.set(0);
    y.set(0);
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
      className="relative h-96 w-72 rounded-xl bg-neutral-800"
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
        <div className="inset-4 hover:text-white text-5xl opacity-0 hover:opacity-80 hover:cursor-pointer transition-all hover:animate-pulse z-50" onClick={() => setIsOpen(true)}>
            <FiMaximize2 />
          </div>
          <AnimeDetailModal {...cartoon} isOpen={isOpen} setIsOpen={setIsOpen}/>
        <div className="p-4 absolute inset-0 bg-black rounded-xl z-10 opacity-60 flex flex-col"></div>
      </div>
    </motion.div>
  );
};

export default TiltCard;
