/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        serif: ['"DM Serif Display"', 'serif'],
      },
      colors: {
        // Custom color mapping to ensure consistency if exact tokens are used without arbitrary values
        navy: {
          100: '#E6E9F0',
          500: '#1E3055',    // --navy-3
          700: '#162647',    // --navy-2
          900: '#0F1F3D',    // --navy
        }
      }
    },
  },
  plugins: [],
}
