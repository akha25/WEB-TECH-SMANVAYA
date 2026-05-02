import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CustomCursor = () => {
  const [isHovered, setIsHovered] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 150 };
  const innerX = useSpring(cursorX, { damping: 10, stiffness: 500 });
  const innerY = useSpring(cursorY, { damping: 10, stiffness: 500 });
  const outerX = useSpring(cursorX, springConfig);
  const outerY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleHover = (e) => {
      const target = e.target;
      if (
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('.card-float') ||
        target.closest('button') ||
        target.closest('a')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleHover);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleHover);
    };
  }, []);

  return (
    <>
      <motion.div
        className="custom-cursor-dot"
        style={{
          x: innerX,
          y: innerY,
        }}
      />
      <motion.div
        className={`custom-cursor ${isHovered ? 'cursor-hover' : ''}`}
        style={{
          x: outerX,
          y: outerY,
        }}
        animate={{
          scale: isHovered ? 2 : 1,
        }}
      />
    </>
  );
};

export default CustomCursor;
