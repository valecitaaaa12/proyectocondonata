/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
        dark: {
          900: '#0a0010',
          800: '#130020',
          700: '#1e0033',
          600: '#2a0047',
          500: '#380060',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      animation: {
        'float':       'float 4s ease-in-out infinite',
        'float-slow':  'float 6s ease-in-out infinite',
        'pulse-slow':  'pulse 3s ease-in-out infinite',
        'fade-up':     'fadeUp 0.6s ease both',
        'fade-up-sm':  'fadeUpSm 0.4s ease both',
        'shimmer':     'shimmer 2s linear infinite',
        'wiggle':      'wiggle 0.4s ease',
        'fade-in':     'fadeIn 0.5s ease both',
        'slide-in-r':  'slideInRight 0.35s ease both',
        'slide-in-l':  'slideInLeft 0.35s ease both',
        'pop':         'pop 0.3s cubic-bezier(0.34,1.56,0.64,1) both',
        'glow-pulse':  'glowPulse 2s ease-in-out infinite',
        'card-enter':  'cardEnter 0.5s cubic-bezier(0.22,1,0.36,1) both',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':       { transform: 'translateY(-16px)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeUpSm: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        wiggle: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%':       { transform: 'translateX(-10px)' },
          '40%':       { transform: 'translateX(10px)' },
          '60%':       { transform: 'translateX(-8px)' },
          '80%':       { transform: 'translateX(8px)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(20px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-20px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        pop: {
          from: { opacity: '0', transform: 'scale(0.85)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 12px 2px rgba(236,72,153,0.25)' },
          '50%':       { boxShadow: '0 0 28px 6px rgba(236,72,153,0.50)' },
        },
        cardEnter: {
          from: { opacity: '0', transform: 'translateY(20px) scale(0.97)' },
          to:   { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(ellipse 80% 60% at 60% 40%, rgba(236,72,153,0.3) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 15% 80%, rgba(168,85,247,0.2) 0%, transparent 60%), linear-gradient(135deg, #0a0010 0%, #1e0033 100%)',
      }
    },
  },
  plugins: [],
}
