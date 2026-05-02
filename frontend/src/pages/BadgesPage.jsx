import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Zap, Heart, Droplets, Moon, Target } from 'lucide-react';

const BadgeCard = ({ name, desc, icon: Icon, earned, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay }}
    className={`glass p-8 rounded-[40px] flex flex-col items-center text-center gap-6 relative overflow-hidden group ${!earned && 'opacity-60 grayscale'}`}
  >
    <div className={`w-24 h-24 rounded-full flex items-center justify-center relative ${earned ? 'animate-pulse' : ''}`} style={{ backgroundColor: earned ? `${color}15` : 'rgba(128,128,128,0.1)' }}>
      <Icon size={40} style={{ color: earned ? color : '#8899bb' }} />
      {earned && (
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-2 border-dashed rounded-full"
          style={{ borderColor: `${color}44` }}
        />
      )}
    </div>

    <div>
      <h3 className="text-xl font-bold mb-2">{name}</h3>
      <p className="text-textMuted text-sm font-medium">{desc}</p>
    </div>

    <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
      earned ? 'bg-success/10 border-success/20 text-success' : 'bg-surface border-border text-textMuted'
    }`}>
      {earned ? '✅ Earned' : '🔒 Locked'}
    </div>
    
    {earned && (
      <div className="absolute top-0 right-0 p-4">
        <div className="w-2 h-2 rounded-full bg-success shadow-[0_0_10px_#34d399]" />
      </div>
    )}
  </motion.div>
);

const BadgesPage = () => {
  const badges = [
    { name: "Early Bird", desc: "Log health vitals before 8 AM for 7 consecutive days.", icon: Moon, earned: true, color: '#818cf8', delay: 0.1 },
    { name: "Hydration Hero", desc: "Meet your daily water intake goal for 5 days straight.", icon: Droplets, earned: true, color: '#38bdf8', delay: 0.2 },
    { name: "Step Master", desc: "Walk more than 10,000 steps in a single day.", icon: Zap, earned: true, color: '#fbbf24', delay: 0.3 },
    { name: "Heart Guardian", desc: "Maintain a healthy resting heart rate for a month.", icon: Heart, earned: false, color: '#f87171', delay: 0.4 },
    { name: "Consistency King", desc: "Log your health data for 30 days without fail.", icon: Target, earned: false, color: '#34d399', delay: 0.5 },
    { name: "Wellness Pro", desc: "Achieve all your health goals for an entire week.", icon: Trophy, earned: false, color: '#a855f7', delay: 0.6 },
  ];

  return (
    <div className="flex flex-col gap-10">
      <header>
        <h1 className="text-4xl font-syne font-extrabold mb-2">Achievements 🏆</h1>
        <p className="text-textMuted font-medium">Celebrate your milestones and unlock your potential.</p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {badges.map((badge, i) => <BadgeCard key={i} {...badge} />)}
      </div>
    </div>
  );
};

export default BadgesPage;
