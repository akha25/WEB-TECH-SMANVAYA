import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'aurora', 'saffron', 'midnight-rose');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = (newTheme) => {
    if (typeof newTheme === 'string') {
      setTheme(newTheme);
    } else {
      setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
