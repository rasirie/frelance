/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'background': 'var(--color-background)',
        'card': 'var(--color-card)',
        'primary': 'var(--color-neon-purple)',
        'secondary': 'var(--color-electric-blue)',
        'success': 'var(--color-success-green)',
        'graphite': 'var(--color-graphite)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'border': 'var(--color-border)',
      },
      fontFamily: {
        'sans': ['Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      fontWeight: {
          'normal': 400,
          'semibold': 600,
          'extrabold': 800,
      },
      keyframes: {
          'slide-down': {
              '0%': { opacity: 0, transform: 'translateY(-15px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' },
          },
          'fade-in': {
              '0%': { opacity: 0 },
              '100%': { opacity: 1 },
          },
          'search-wiggle': {
              '0%, 100%': { transform: 'rotate(-3deg)' },
              '50%': { transform: 'rotate(3deg)' },
          }
      },
      animation: {
          'slide-down': 'slide-down 0.4s ease-out forwards',
          'fade-in': 'fade-in 0.5s ease-out forwards',
          'search-wiggle': 'search-wiggle 1s ease-in-out infinite',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(90deg, var(--color-electric-blue) 0%, var(--color-neon-purple) 100%)',
      },
      boxShadow: {
        'brand': '0px 4px 16px rgba(0, 0, 0, 0.15)',
        'brand-dark': '0px 4px 16px rgba(0, 0, 0, 0.3)',
      },
      borderRadius: {
        'xl': '16px',
      }
    },
  },
  plugins: [],
}
