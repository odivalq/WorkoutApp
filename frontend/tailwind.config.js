/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        strength: '#ef4444',
        cardio:   '#f97316',
        stretch:  '#22c55e',
      },
      screens: {
        xs: '375px',
      },
    },
  },
  plugins: [],
}
