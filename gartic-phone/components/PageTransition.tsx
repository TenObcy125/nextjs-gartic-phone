"use client";

import { motion, useAnimation } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";

interface PageTransitionProps {
  children: ReactNode;
  text?: string;
}

export default function PageTransition({ children, text = "Stwórz grę!" }: PageTransitionProps) {
  const [showOverlay, setShowOverlay] = useState(true);
  const overlayControls = useAnimation();
  const textControls = useAnimation();

  useEffect(() => {
    const runAnimation = async () => {
      await overlayControls.start({ y: "0%", transition: { duration: 0.7, ease: "easeInOut" } });

      await textControls.start({
        y: [0, -50, 0, -20, 0],
        scale: [1, 1.3, 1, 1.15, 1],
        opacity: [0, 1, 1, 1, 1],
        transition: { duration: 1.5, times: [0, 0.25, 0.5, 0.75, 1], ease: [0.68, -0.55, 0.27, 1.55] },
      });

      await overlayControls.start({ y: "100%", transition: { duration: 0.7, ease: "easeInOut" } });

      setShowOverlay(false);
    };

    runAnimation();
  }, [overlayControls, textControls]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {showOverlay && (
        <motion.div
          className="fixed top-0 left-0 w-full h-screen z-50 flex items-center justify-center
                     bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"
          initial={{ y: "-100%" }}
          animate={overlayControls}
        >
          <motion.h1
            className="text-white text-5xl font-extrabold absolute"
            initial={{ y: 0, scale: 1, opacity: 0 }}
            animate={textControls}
          >
            {text}
          </motion.h1>
        </motion.div>
      )}

      {!showOverlay && <div className="w-full h-full">{children}</div>}
    </div>
  );
}
