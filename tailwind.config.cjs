/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./node_modules/flowbite-react/**/*.js', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  plugins: [require('flowbite/plugin')],
  theme: {
    extend: {},
  },
}
