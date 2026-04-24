/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Satoshi', 'sans-serif'] },
      colors: {
        base: '#04040E',
        surface: '#060714',
        'surface-2': '#0A0F1E',
        border: '#0D1325',
        'border-2': '#162035',
        blue: { DEFAULT: '#0057B7', light: '#4D9AFF', dark: '#003A82' },
        text: { 1: '#E8EDF5', 2: '#7A849A', 3: '#3E4A5E' },
      },
      animation: {
        'fade-up': 'fadeUp 0.35s ease both',
        pop: 'pop 0.25s ease both',
      },
      keyframes: {
        fadeUp: { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        pop: { from: { opacity: 0, transform: 'scale(0.96)' }, to: { opacity: 1, transform: 'scale(1)' } },
      },
    },
  },
  plugins: [],
};
