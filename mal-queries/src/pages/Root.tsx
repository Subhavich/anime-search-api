import { NavLink, Outlet } from "react-router-dom";
import { FC } from "react";
import { motion } from "framer-motion";

const RootLayout = () => {
  return (
    <>
      <div className="min-h-screen w-full font-mono bg-neutral-950 text-neutral-500">
        <header className=" w-full py-4 mb-8 text-lg font-extrabold h-36">
          <Navbar />
        </header>
        <Outlet />
      </div>
    </>
  );
};
export default RootLayout;

const Navbar = () => {
  return (
    <nav className="max-w-5xl fixed left-[50%] top-8 flex justify-center w-full -translate-x-[50%] items-center gap-6 rounded-lg border-[1px] border-neutral-700 bg-neutral-900 p-4 text-sm text-neutral-500">
      <p>Anime Browser</p>
      <div className="py-2 px-2 flex items-center overflow-hidden grow justify-end space-x-8">
        <Navigation route="">Home</Navigation>
        <Navigation route="app">App</Navigation>
        <JoinButton />
      </div>
    </nav>
  );
};

interface NavigationProps {
  children: string;
  route: string;
}

const Navigation: FC<NavigationProps> = ({ children, route = "" }) => {
  return (
    <NavLink to={`/${route}`} className="block overflow-hidden">
      <motion.div
        whileHover={{ y: -20 }}
        transition={{ ease: "backInOut", duration: 0.2 }}
        className="h-[20px]"
      >
        <span className="flex h-[20px] items-center">{children}</span>
        <span className="flex h-[20px] items-center text-neutral-50">
          {children}
        </span>
      </motion.div>
    </NavLink>
  );
};

const JoinButton = () => {
  return (
    <button
      className={`
          relative z-0 flex items-center gap-2 overflow-hidden whitespace-nowrap rounded-lg border-[1px]
          border-neutral-700 px-4 py-1.5 font-medium
         text-neutral-300 transition-all duration-300

          before:absolute before:inset-0
          before:-z-10 before:translate-y-[200%]
          before:scale-[2.5]
          before:rounded-[100%] before:bg-neutral-50
          before:transition-transform before:duration-1000
          before:content-[""]

          hover:scale-105 hover:border-neutral-50 hover:text-neutral-900
          hover:before:translate-y-[0%]
          active:scale-100`}
    >
      Join waitlist
    </button>
  );
};
