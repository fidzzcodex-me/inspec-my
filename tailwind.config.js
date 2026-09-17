/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0F172A',
        slate: {
          DEFAULT: '#475569',
          light: '#94A3B8'
        },
        mist: '#F5F9FF',
        line: '#E2E8F0',
        brand: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          400: '#5B9DF9',
          500: '#3B7CF6',
          600: '#2563EB',
          700: '#1D4ED8'
        }
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'sans-serif']
      },
      boxShadow: {
        soft: '0 20px 60px -25px rgba(37,99,235,0.35)',
        card: '0 1px 2px rgba(15,23,42,0.04), 0 8px 24px -12px rgba(15,23,42,0.08)'
      },
      borderRadius: {
        xl2: '1.25rem'
      }
    }
  },
  plugins: []
}
