/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        card: 'var(--card)',
        border: 'var(--border)',
        text: 'var(--text)',
        textMuted: 'var(--textMuted)',
        accent: 'var(--accent)',
        accentAlt: 'var(--accentAlt)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        danger: 'var(--danger)',
        glow: 'var(--glow)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
