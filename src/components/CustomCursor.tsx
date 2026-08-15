"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [cursorText, setCursorText] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check for custom cursor text
      const cursorTarget = target.closest("[data-cursor]");
      if (cursorTarget) {
        const text = cursorTarget.getAttribute("data-cursor");
        setCursorText(text);
        setIsHovering(true);
        return;
      }
      
      // Standard interactive elements
      if (target.closest("button") || target.closest("a") || target.closest("input") || target.closest("select")) {
        setCursorText(null);
        setIsHovering(true);
      } else {
        setCursorText(null);
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  // Hide cursor until mounted to prevent hydration mismatch
  if (!isMounted) return null;

  // Hide cursor on mobile/touch devices
  if (window.matchMedia("(hover: none)").matches) {
    return null;
  }

  const isLabelMode = cursorText !== null;

  return (
    <>
      <motion.div
        className={`fixed top-0 left-0 flex items-center justify-center rounded-full pointer-events-none z-[9999] hidden md:flex font-sans text-[10px] font-bold tracking-widest text-white overflow-hidden ${
          isLabelMode ? "bg-primary" : "bg-accent mix-blend-difference"
        }`}
        animate={{
          x: mousePosition.x - (isLabelMode ? 40 : 8),
          y: mousePosition.y - (isLabelMode ? 40 : 8),
          width: isLabelMode ? 80 : 16,
          height: isLabelMode ? 80 : 16,
          scale: isHovering && !isLabelMode ? 2.5 : 1,
          opacity: isHovering && !isLabelMode ? 0.5 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
          mass: 0.5,
        }}
      >
        <AnimatePresence>
          {isLabelMode && (
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center leading-none"
            >
              {cursorText}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
      <motion.div
        className="fixed top-0 left-0 w-1 h-1 bg-white rounded-full pointer-events-none z-[10000] mix-blend-difference hidden md:block"
        animate={{
          x: mousePosition.x - 2,
          y: mousePosition.y - 2,
          opacity: isLabelMode ? 0 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 1000,
          damping: 40,
          mass: 0.1,
        }}
      />
    </>
  );
}
