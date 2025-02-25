/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.global-border': {
          border: '1px solid #ccc', // 这里可以根据设计需求调整边框样式
        },
      }
      addUtilities(newUtilities)
    }
  ],
};
