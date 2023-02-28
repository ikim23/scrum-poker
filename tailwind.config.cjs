/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./node_modules/flowbite-react/**/*.js", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("flowbite/plugin")],
};
