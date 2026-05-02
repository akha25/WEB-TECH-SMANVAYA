import React from 'react';
import { motion } from 'framer-motion';

const YogaSVG = () => {
  return (
    <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
      {/* Orbiting Circle */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute w-4/5 h-4/5 border-2 border-dashed border-accent/30 rounded-full"
      />
      
      {/* Glowing Backdrop */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute w-1/2 h-1/2 bg-accent blur-3xl rounded-full"
      />

      <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Head */}
        <motion.circle
          cx="100" cy="40" r="10"
          stroke="currentColor" strokeWidth="3"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="text-accent"
        />
        
        {/* Torso */}
        <motion.line
          x1="100" y1="50" x2="100" y2="100"
          stroke="currentColor" strokeWidth="3"
          animate={{ strokeDasharray: ["0, 100", "50, 50"] }}
          transition={{ duration: 2 }}
          className="text-accent"
        />

        {/* Arms */}
        <motion.path
          d="M60 70 Q100 60 140 70"
          stroke="currentColor" strokeWidth="3" strokeLinecap="round"
          animate={{ d: ["M60 70 Q100 60 140 70", "M60 50 Q100 30 140 50", "M60 70 Q100 60 140 70"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="text-accent"
        />

        {/* Legs */}
        <motion.path
          d="M100 100 L70 150 M100 100 L130 150"
          stroke="currentColor" strokeWidth="3" strokeLinecap="round"
          animate={{ d: [
            "M100 100 L70 150 M100 100 L130 150",
            "M100 100 L60 130 M100 100 L140 130",
            "M100 100 L70 150 M100 100 L130 150"
          ] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="text-accent"
        />
      </svg>
    </div>
  );
};

export default YogaSVG;
