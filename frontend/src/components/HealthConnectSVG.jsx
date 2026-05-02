import React from 'react';
import { motion } from 'framer-motion';

const HealthConnectSVG = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="relative w-full max-w-[400px] aspect-square flex items-center justify-center"
    >
      <svg viewBox="0 0 500 500" className="w-full h-full drop-shadow-2xl">
        <defs>
          <linearGradient id="blueGreenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0066FF" />
            <stop offset="100%" stopColor="#00FF87" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Circular Swoosh */}
        <motion.path
          d="M 400,250 A 150,150 0 1,1 100,250"
          fill="none"
          stroke="url(#blueGreenGradient)"
          strokeWidth="8"
          strokeLinecap="round"
          initial={{ pathLength: 0, rotate: -45 }}
          animate={{ pathLength: 1, rotate: 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        <motion.path
          d="M 100,250 A 150,150 0 0,1 400,250"
          fill="none"
          stroke="url(#blueGreenGradient)"
          strokeWidth="4"
          strokeDasharray="10,15"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.5, ease: "easeInOut", delay: 0.5 }}
        />

        {/* Hands */}
        <motion.path
          d="M 170,350 Q 150,300 200,250 Q 220,280 220,320 L 220,360 Z"
          fill="#0066FF"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        />
        <motion.path
          d="M 330,350 Q 350,300 300,250 Q 280,280 280,320 L 280,360 Z"
          fill="#00FF87"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        />

        {/* Person Figure */}
        <motion.circle
          cx="250"
          cy="280"
          r="15"
          fill="url(#blueGreenGradient)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.2, type: "spring" }}
        />
        <motion.path
          d="M 210,270 Q 250,320 290,270 L 270,330 Q 250,350 230,330 Z"
          fill="url(#blueGreenGradient)"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        />

        {/* Heart & Heartbeat */}
        <g filter="url(#glow)">
          <motion.path
            d="M 250,220 C 250,220 230,180 200,180 C 170,180 170,220 200,240 L 250,280 L 300,240 C 330,220 330,180 300,180 C 270,180 250,220 250,220"
            fill="none"
            stroke="url(#blueGreenGradient)"
            strokeWidth="4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.8 }}
          />
          <motion.path
            d="M 210,210 L 230,210 L 235,190 L 245,230 L 250,210 L 290,210"
            fill="none"
            stroke="#0066FF"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ 
              pathLength: { duration: 1, delay: 2, repeat: Infinity, repeatDelay: 1 },
              opacity: { duration: 0.2 }
            }}
          />
        </g>

        {/* Text Elements */}
        <motion.text
          x="250"
          y="420"
          textAnchor="middle"
          className="text-4xl font-black fill-current"
          style={{ letterSpacing: '8px', fill: 'var(--text)' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
        >
          SAMANVAYA
        </motion.text>
        <motion.text
          x="250"
          y="450"
          textAnchor="middle"
          className="text-sm font-bold uppercase tracking-[10px]"
          style={{ fill: 'var(--textMuted)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
        >
          HEALTH CONNECT
        </motion.text>
        
        {/* Tagline */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
        >
          <path d="M 120,480 L 140,480 L 145,470 L 155,490 L 160,480 L 180,480" fill="none" stroke="#0066FF" strokeWidth="2" />
          <text x="250" y="485" textAnchor="middle" className="text-[10px] italic font-medium" style={{ fill: 'var(--accent)' }}>
            Together for a Healthier Tomorrow
          </text>
          <path d="M 320,480 L 340,480 L 345,470 L 355,490 L 360,480 L 380,480" fill="none" stroke="#00FF87" strokeWidth="2" />
        </motion.g>
      </svg>

      {/* Floating Particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-accent"
          animate={{
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.5,
          }}
          style={{
            left: `${40 + Math.random() * 20}%`,
            top: `${40 + Math.random() * 20}%`,
          }}
        />
      ))}
    </motion.div>
  );
};

export default HealthConnectSVG;
