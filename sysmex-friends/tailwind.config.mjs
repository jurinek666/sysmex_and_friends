/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tvoje definované barvy z globals.css
        sysmex: {
          900: '#0B1E4B', // --ngg-nav-900
          850: '#0E265B', // --ngg-nav-850
          800: '#12306A', // --ngg-nav-800
          700: '#1E4EA8', // --ngg-nav-700
        },
        neon: {
          cyan: '#46D6FF',   // --ngg-a-cyan
          magenta: '#FF4FD8',// --ngg-a-magenta
          gold: '#FBD986',   // --ngg-a-gold
        }
      },
      boxShadow: {
        'glass-top': '0 6px 18px rgba(11, 30, 75, .10)',
        'glass-scroll': '0 14px 34px rgba(11, 30, 75, .22)',
      },
      animation: {
        'glow-move': 'ngg-glowMove 8s linear infinite',
      },
      keyframes: {
        'ngg-glowMove': {
           '0%': { backgroundPosition: '0% 50%' },
           '100%': { backgroundPosition: '200% 50%' },
        }
      }
    },
  },
  plugins: [],
};

export default config;