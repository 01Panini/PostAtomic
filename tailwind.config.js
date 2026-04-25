/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['Inter', 'sans-serif'],
        display: ['Inter', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        /* ── Sassy surface stack ── */
        bg:       '#050505',
        surface:  '#121212',
        's2':     '#161616',
        card:     '#191919',
        elevated: '#1C1B1B',

        /* ── Text ── */
        t1: '#FFFFFF',
        t2: '#A8A8A8',
        t3: '#616161',

        /* ── Accents ── */
        green: {
          DEFAULT: '#0CC981',
          bright:  '#00FF2A',
        },
        blue: {
          DEFAULT: '#2467E3',
        },

        /* ── Legacy aliases (keep backward compat) ── */
        void:      '#050505',
        cosmos:    '#0F0F0F',
        nebula:    '#121212',
        stellar:   '#161616',
        aurora:    '#191919',
        horizon:   '#1C1B1B',
        quasar:    '#252525',
        dust:      '#616161',
        cloud:     '#A8A8A8',
        star:      '#FFFFFF',
        electric:  '#0CC981',
        nova:      '#0CC981',
        solar:     '#F59E0B',
        flare:     '#EF4444',

        /* ── Old blue system kept for Slide.jsx ── */
        'blue-light': '#60A5FA',
        'blue-dark':  '#1E40AF',
        'blue-glow':  '#93C5FD',

        /* ── Semantic ── */
        base:        '#050505',
        'surface-2': '#161616',
        border:      'rgba(255,255,255,0.08)',
        'border-2':  'rgba(255,255,255,0.12)',
        'text-1':    '#FFFFFF',
        'text-2':    '#A8A8A8',
        'text-3':    '#616161',
      },
      borderColor: {
        DEFAULT: 'rgba(255,255,255,0.08)',
      },
      backgroundImage: {
        'aurora': 'radial-gradient(ellipse at 60% 30%, rgba(0,255,42,0.13) 0%, transparent 60%), radial-gradient(ellipse at 40% 70%, rgba(12,201,129,0.10) 0%, transparent 55%)',
        'card-glass': 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
      },
      boxShadow: {
        'green-glow': '0 0 40px rgba(12,201,129,0.25), 0 0 80px rgba(12,201,129,0.08)',
        'card':       '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.55)',
        'btn':        '0 4px 20px rgba(12,201,129,0.3)',
        'nav':        '0 1px 0 rgba(255,255,255,0.06)',
      },
      animation: {
        'fade-up':    'fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both',
        'fade-in':    'fadeIn 0.3s ease both',
        'pop':        'pop 0.25s ease both',
        'marquee':    'marquee 28s linear infinite',
        'spin-slow':  'spin 3s linear infinite',
        'pulse-green':'pulseGreen 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: 0, transform: 'translateY(60px)' },
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
        marquee: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
        pulseGreen: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(12,201,129,0.4)' },
          '50%':      { boxShadow: '0 0 0 8px rgba(12,201,129,0)' },
        },
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
