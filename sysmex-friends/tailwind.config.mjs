/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sysmex: {
          950: '#020617', // Téměř černá (Main Background)
          900: '#0B1E4B', // Původní tmavá modrá (Secondary BG)
          800: '#12306A', // Card BG
          700: '#1E4EA8', // Borders / Accents
          100: '#E0E7FF', // Text light
        },
        neon: {
          cyan: '#46D6FF',
          magenta: '#FF4FD8',
          gold: '#FBD986',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'card-glass': 'linear-gradient(180deg, rgba(18, 48, 106, 0.4) 0%, rgba(11, 30, 75, 0.6) 100%)',
      },
      boxShadow: {
        'neon': '0 0 20px -5px rgba(70, 214, 255, 0.15)',
        'glow-hover': '0 0 30px -5px rgba(70, 214, 255, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};