/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        xs: '420px',
      },
      colors: {
        chess: {
          dark: '#1e2022',
          darker: '#161719',
          boardDark: '#739552',
          boardLight: '#ebecd0',
          accent: '#81b64c',
          accentHover: '#98c863',
          card: '#262522',
          cardBorder: '#363531',
          blunder: '#fa412d',
          mistake: '#ffa400',
          inaccuracy: '#f0c15c',
          good: '#96bc4b',
          best: '#81b64c',
          brilliant: '#1baca6',
          book: '#d5a47d'
        }
      }
    },
  },
  plugins: [],
}
