/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Bimatic Brand Colors
        bimatic: {
          DEFAULT: '#1E90FF',
          light: '#5CACFF',
          dark: '#0066CC',
          50: '#E6F3FF',
          100: '#CCE7FF',
          200: '#99CFFF',
          300: '#66B7FF',
          400: '#339FFF',
          500: '#1E90FF',
          600: '#0077E6',
          700: '#0066CC',
          800: '#0055B3',
          900: '#004499',
        }
      },
      fontFamily: {
        sans: ['Roboto', 'Open Sans', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
