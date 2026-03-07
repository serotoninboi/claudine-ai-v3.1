import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
        body: ['DM Mono', 'monospace'],
      },
      colors: {
        pink: {
          50:  '#fff0f5',
          100: '#ffd6e7',
          200: '#ffadc9',
          300: '#ff80aa',
          400: '#ff4d8a',
          500: '#ff2d78',
          600: '#e0165f',
          700: '#b80e4c',
          800: '#8c0b3a',
          900: '#5c0725',
        },
        dark: {
          50:  '#f0eae8',
          100: '#3d3636',
          200: '#2a2020',
          300: '#1c1c1c',
          400: '#161616',
          500: '#111111',
          600: '#0d0d0d',
          700: '#0a0a0a',
          800: '#080808',
          900: '#050505',
        }
      },
      animation: {
        'fade-up':    'fadeUp 0.5s ease forwards',
        'spin-slow':  'spin 3s linear infinite',
        'pink-pulse': 'pinkPulse 2.5s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pinkPulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255,45,120,0.25)' },
          '50%':      { boxShadow: '0 0 16px 4px rgba(255,45,120,0.25)' },
        }
      },
    },
  },
  plugins: [],
}
export default config
