import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Dumbbell, Utensils, Activity, User, Heart
} from 'lucide-react';

const BottomNav = () => {
  const links = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
    { to: '/workouts', icon: Dumbbell, label: 'Gym' },
    { to: '/nutrition', icon: Utensils, label: 'Food' },
    { to: '/mindfulness', icon: Heart, label: 'Zen' },
    { to: '/profile', icon: User, label: 'Me' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[50] md:hidden bg-surface/80 backdrop-blur-xl border-t border-border px-4 py-3">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `relative flex flex-col items-center gap-1 transition-colors ${
              isActive ? 'text-accent' : 'text-textMuted'
            }`}
          >
            {({ isActive }) => (
              <>
                <link.icon size={22} className={isActive ? 'scale-110' : ''} />
                <span className="text-[10px] font-bold uppercase tracking-tighter">{link.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="bottomNavTab"
                    className="absolute -top-3 w-1 h-1 bg-accent rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
