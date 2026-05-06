import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        night: {
          50: '#f0ebff',
          100: '#e0d5ff',
          200: '#c2abff',
          300: '#a280ff',
          400: '#8255ff',
          500: '#622aff',
          600: '#4f00f5',
          700: '#3d00c2',
          800: '#2a0088',
          900: '#180055',
          950: '#0f0035',
        },
        glow: {
          purple: '#8B5CF6',
          pink: '#EC4899',
          orange: '#F97316',
          blue: '#3B82F6',
          cyan: '#06B6D4',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-night':
          'linear-gradient(135deg, #0F0A1E 0%, #1A0A2E 40%, #0D1A2E 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(139,92,246,0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(139,92,246,0.8), 0 0 80px rgba(236,72,153,0.3)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'glow-purple': '0 0 30px rgba(139,92,246,0.4)',
        'glow-pink': '0 0 30px rgba(236,72,153,0.4)',
        'glow-orange': '0 0 30px rgba(249,115,22,0.4)',
        'glass': '0 8px 32px rgba(0,0,0,0.4)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

export default config
