import React from 'react';
import { motion } from 'framer-motion';

const CircularProgress = ({ value, goal, color, icon: Icon, label, size = 120 }) => {
  const percentage = Math.min((value / goal) * 100, 100);
  const radius = size * 0.4;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-4 group">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background Circle */}
        <svg className="rotate-[-90deg]" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={size * 0.08}
            fill="transparent"
            className="text-surface"
          />
          {/* Progress Circle */}
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={size * 0.08}
            strokeDasharray={circumference}
            fill="transparent"
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 8px ${color}4d)` }}
          />
        </svg>
        
        {/* Center Icon/Value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-current"
            style={{ color }}
          >
            <Icon size={size * 0.25} />
          </motion.div>
          <span className="text-xs font-bold mt-1">{Math.round(percentage)}%</span>
        </div>
      </div>
      
      <div className="text-center">
        <h4 className="text-[10px] font-bold text-textMuted uppercase tracking-widest">{label}</h4>
        <p className="text-sm font-black">{value.toLocaleString()} <span className="text-[10px] opacity-50">{goal.toLocaleString()}</span></p>
      </div>
    </div>
  );
};

export default CircularProgress;
