/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Satoshi', 'sans-serif'],
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        // Cosmic dark palette
        void:    '#03091A',
        cosmos:  '#060E20',
        nebula:  '#0A1628',
        stellar: '#101E35',
        aurora:  '#162845',
        horizon: '#1E3560',
        quasar:  '#2D4D7E',
        dust:    '#4D6B8A',
        cloud:   '#8BA8C8',
        star:    '#C8D8EC',

        // Semantic aliases (keep backward compat)
        base:       '#03091A',
        surface:    '#060E20',
        'surface-2':'#0A1628',
        border:     '#1E3560',
        'border-2': '#2D4D7E',

        // Text hierarchy
        text: {
          1: '#F0F6FF',
          2: '#8BA8C8',
          3: '#4D6B8A',
        },

        // Accent
        blue: {
          DEFAULT: '#2563EB',
          light:   '#60A5FA',
          dark:    '#1E40AF',
          glow:    '#93C5FD',
        },
        electric: '#2563EB',

        // Status
        nova:  '#10B981',
        solar: '#F59E0B',
        flare: '#EF4444',
      },
      backgroundImage: {
        'cosmic': 'radial-gradient(ellipse 100% 70% at 50% -15%, rgba(37,99,235,0.22) 0%, transparent 65%), radial-gradient(ellipse 70% 50% at 85% 60%, rgba(99,102,241,0.08) 0%, transparent 55%), #03091A',
        'nebula-glow': 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(37,99,235,0.18) 0%, transparent 60%)',
        'card-glass': 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
      },
      boxShadow: {
        'blue-glow':   '0 0 40px rgba(37,99,235,0.35), 0 0 80px rgba(37,99,235,0.15)',
        'card':        '0 1px 0 rgba(255,255,255,0.05) inset, 0 8px 32px rgba(0,0,0,0.4)',
        'card-hover':  '0 1px 0 rgba(255,255,255,0.08) inset, 0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(37,99,235,0.2)',
        'btn-primary': '0 4px 24px rgba(37,99,235,0.45), 0 1px 0 rgba(255,255,255,0.1) inset',
      },
      animation: {
        'fade-up':      'fadeUp 0.6s ease both',
        'fade-in':      'fadeIn 0.4s ease both',
        'pop':          'pop 0.25s ease both',
        'glow-pulse':   'glowPulse 3s ease-in-out infinite',
        'float':        'float 6s ease-in-out infinite',
        'shimmer':      'shimmer 2.5s linear infinite',
        'star-twinkle': 'starTwinkle 3s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to:   { opacity: 1 },
        },
        pop: {
          from: { opacity: 0, transform: 'scale(0.94)' },
          to:   { opacity: 1, transform: 'scale(1)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(37,99,235,0.3), 0 0 60px rgba(37,99,235,0.1)' },
          '50%':      { boxShadow: '0 0 40px rgba(37,99,235,0.5), 0 0 100px rgba(37,99,235,0.2)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        starTwinkle: {
          from: { opacity: 0.4 },
          to:   { opacity: 1 },
        },
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
};
