/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        espresso: { 950: '#1a0f08', 900: '#241510', 800: '#3a241a', 700: '#4d3324', 600: '#6b4a35' },
        mocha: { 500: '#8a5a3b', 400: '#a8714a', 300: '#c08d63' },
        caramel: { 400: '#c8995f', 300: '#d9ad7a', 200: '#e6c79c', 100: '#f0dcb8' },
        cream: { 50: '#fbf6ee', 100: '#f5ead8', 200: '#ecd9bd' },
        gold: { 500: '#b8893f', 400: '#cda455', 300: '#e0bd76' },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'lux': '0 18px 50px -20px rgba(26, 15, 8, 0.55)',
        'inner-lux': 'inset 0 1px 0 0 rgba(224, 189, 118, 0.18)',
      },
    },
  },
  plugins: [],
};
