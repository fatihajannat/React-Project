/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eefdfb',
          100: '#d4f7f1',
          200: '#a9efe3',
          300: '#74e0d0',
          400: '#3fc7b7',
          500: '#1fa89a',
          600: '#17857c',
          700: '#166a64',
          800: '#155450',
          900: '#144542',
        },
        coral: {
          400: '#ff8a72',
          500: '#f9694c',
          600: '#e4522f',
        },
      },
      fontFamily: {
        display: ['"Poppins"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

