/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Nunito"', 'sans-serif'],
        body: ['"Nunito"', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      colors: {
        poke: {
          red: '#E3350D', redlight: '#FF5B3A', reddark: '#B02A0A',
          white: '#FFFFFF', offwhite: '#F8F4F0', cream: '#FFF5F3',
          black: '#1A1A1A', gray: '#6B6B6B', lightgray: '#E8E0DB',
          border: '#D9CFC9', gold: '#FFD700', blue: '#3B7DDD', green: '#4CAF50',
        },
      },
      boxShadow: {
        'poke': '0 4px 24px rgba(227,53,13,0.15)',
        'poke-lg': '0 8px 40px rgba(227,53,13,0.2)',
        'card': '0 2px 16px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.12)',
      },
      animation: {
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'bounce-sm': 'bounceSm 0.6s ease-out',
        'fade-in': 'fadeIn 0.35s ease-out',
        'slide-up': 'slideUp 0.35s ease-out',
      },
      keyframes: {
        sparkle: { '0%,100%': { opacity: 1, transform: 'scale(1)' }, '50%': { opacity: 0.7, transform: 'scale(1.2)' } },
        float: { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-8px)' } },
        bounceSm: { '0%': { transform: 'scale(0.95)' }, '60%': { transform: 'scale(1.05)' }, '100%': { transform: 'scale(1)' } },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
