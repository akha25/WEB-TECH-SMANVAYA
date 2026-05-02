import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, LogOut, Menu, X, Palette, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);
  const [showThemePicker, setShowThemePicker] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);

  const notifications = [
    { id: 1, text: "Welcome to SAMANVAYA 2.0! ✨", time: "Just now", icon: "🚀" },
    { id: 2, text: "You hit 50% of your daily steps! 👟", time: "2h ago", icon: "🎯" },
    { id: 3, text: "SEVA has a new tip for you! 🧘", time: "5h ago", icon: "💡" },
  ];

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', roles: ['user', 'admin'] },
    { name: 'Log Health', path: '/log', roles: ['user'] },
    { name: 'Nutrition', path: '/nutrition', roles: ['user'] },
    { name: 'Workouts', path: '/workouts', roles: ['user'] },
    { name: 'Mindfulness', path: '/mindfulness', roles: ['user'] },
    { name: 'Requests', path: '/requests', roles: ['user', 'volunteer', 'admin'] },
    { name: 'Admin', path: '/admin', roles: ['admin'] },
    { name: 'Analytics', path: '/analytics', roles: ['admin'] },
    { name: 'Profile', path: '/profile', roles: ['user', 'volunteer', 'admin'] },
  ];

  const themes = [
    { id: 'light', color: '#10b981', name: 'Light' },
    { id: 'dark', color: '#34d399', name: 'Dark' },
    { id: 'aurora', color: '#ec4899', name: 'Aurora' },
    { id: 'saffron', color: '#ff9500', name: 'Saffron' },
    { id: 'midnight-rose', color: '#b76e79', name: 'Midnight Rose' },
  ];

  const filteredLinks = user 
    ? navLinks.filter(link => link.roles.includes(user.role))
    : [];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.nav 
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50 h-16 flex items-center px-6 md:px-12 justify-between"
    >
      <Link to="/" className="flex items-center gap-2 group">
        <motion.span 
          whileHover={{ scale: 1.05 }}
          className="text-2xl font-extrabold text-accent"
        >
          SAMANVAYA
        </motion.span>
      </Link>

      {/* Desktop Links */}
      <div className="hidden lg:flex items-center gap-6">
        {filteredLinks.map(link => (
          <Link 
            key={link.path} 
            to={link.path}
            className="text-textMuted hover:text-accent transition-colors font-bold text-xs uppercase tracking-widest"
          >
            {link.name}
          </Link>
        ))}
        
        <div className="relative">
          <button 
            onClick={() => { setShowNotifications(!showNotifications); setShowThemePicker(false); }}
            className="p-2 rounded-full hover:bg-accent/10 text-text transition-all duration-300 relative"
          >
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full border border-bg" />
          </button>
          
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-4 p-6 glass rounded-[32px] flex flex-col gap-4 min-w-[320px] shadow-2xl border-accent/20"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-extrabold uppercase tracking-widest">Notifications</h4>
                  <span className="text-[10px] font-bold text-accent">Mark all as read</span>
                </div>
                <div className="flex flex-col gap-3">
                  {notifications.map(n => (
                    <div key={n.id} className="flex gap-4 p-3 rounded-2xl hover:bg-accent/5 transition-colors cursor-pointer group">
                      <div className="text-xl bg-surface w-10 h-10 rounded-xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">{n.icon}</div>
                      <div className="flex flex-col gap-0.5">
                        <p className="text-xs font-bold leading-tight">{n.text}</p>
                        <span className="text-[10px] text-textMuted font-bold uppercase tracking-widest">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="mt-2 text-center text-[10px] font-bold uppercase tracking-widest text-textMuted hover:text-accent transition-colors">View All Notifications</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative">
          <button 
            onClick={() => { setShowThemePicker(!showThemePicker); setShowNotifications(false); }}
            className="p-2 rounded-full hover:bg-accent/10 text-text transition-all duration-300"
          >
            <Palette size={20} />
          </button>
          
          <AnimatePresence>
            {showThemePicker && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-4 p-4 glass rounded-2xl flex flex-col gap-3 min-w-[180px] shadow-2xl"
              >
                <div className="grid grid-cols-5 gap-2">
                  {themes.map(t => (
                    <button
                      key={t.id}
                      onClick={() => { toggleTheme(t.id); setShowThemePicker(false); }}
                      className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-125 ${theme === t.id ? 'border-accent scale-110 shadow-[0_0_10px_var(--glow)]' : 'border-transparent'}`}
                      style={{ backgroundColor: t.color }}
                      title={t.name}
                    />
                  ))}
                </div>
                <div className="border-t border-border/50 pt-2 flex flex-col gap-1">
                   {themes.map(t => (
                     <button
                       key={t.id}
                       onClick={() => { toggleTheme(t.id); setShowThemePicker(false); }}
                       className={`text-[10px] font-bold uppercase tracking-widest text-left px-2 py-1 rounded-md transition-colors ${theme === t.id ? 'bg-accent/10 text-accent' : 'text-textMuted hover:bg-surface'}`}
                     >
                       {t.name}
                     </button>
                   ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {user ? (
          <button 
            onClick={handleLogout}
            className="p-2 rounded-full hover:bg-danger/10 text-danger transition-colors"
          >
            <LogOut size={20} />
          </button>
        ) : (
          <Link 
            to="/auth"
            className="px-6 py-2 rounded-full bg-accent text-white font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform"
          >
            Sign In
          </Link>
        )}
      </div>

      {/* Mobile Actions */}
      <div className="lg:hidden flex items-center gap-4">
        <button onClick={() => setShowThemePicker(!showThemePicker)} className="p-2 rounded-full hover:bg-accent/10 text-text transition-all">
          <Palette size={20} />
        </button>
        {user ? (
          <button 
            onClick={handleLogout}
            className="p-2 rounded-full hover:bg-danger/10 text-danger transition-colors"
          >
            <LogOut size={20} />
          </button>
        ) : (
          <Link to="/auth" className="p-2 rounded-full hover:bg-accent/10 text-accent transition-all">
            <LogOut size={20} className="rotate-180" />
          </Link>
        )}
      </div>

      {/* Theme Picker Dropdown (Shared for Mobile/Desktop) */}
      <AnimatePresence>
        {showThemePicker && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-6 md:right-12 top-16 p-4 glass rounded-2xl flex flex-col gap-3 min-w-[180px] shadow-2xl z-[60]"
          >
            <div className="grid grid-cols-5 gap-2">
              {themes.map(t => (
                <button
                  key={t.id}
                  onClick={() => { toggleTheme(t.id); setShowThemePicker(false); }}
                  className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-125 ${theme === t.id ? 'border-accent scale-110 shadow-[0_0_10px_var(--glow)]' : 'border-transparent'}`}
                  style={{ backgroundColor: t.color }}
                  title={t.name}
                />
              ))}
            </div>
            <div className="border-t border-border/50 pt-2 flex flex-col gap-1">
                {themes.map(t => (
                  <button
                    key={t.id}
                    onClick={() => { toggleTheme(t.id); setShowThemePicker(false); }}
                    className={`text-[10px] font-bold uppercase tracking-widest text-left px-2 py-1 rounded-md transition-colors ${theme === t.id ? 'bg-accent/10 text-accent' : 'text-textMuted hover:bg-surface'}`}
                  >
                    {t.name}
                  </button>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
