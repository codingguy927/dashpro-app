/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',          // ← add this line
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter','sans-serif'] },
      colors: {
        primary: { light: '#4F8EF7', DEFAULT: '#3366FF', dark: '#274BDB' },
        accent: { green: '#38D397', red: '#F87171', yellow: '#FBBF24' },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
