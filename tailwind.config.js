/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-pink': '#FF00FF',
        'neon-blue': '#00FFFF',
        'neon-green': '#39FF14',
        'neon-purple': '#BC13FE',
        'dark-bg': '#0F0F12',
        'darker-bg': '#070709',
      },
      fontFamily: {
        'cyber': ['Orbitron', 'sans-serif'],
      },
      boxShadow: {
        'neon-pink': '0 0 5px #FF00FF, 0 0 10px #FF00FF, 0 0 15px #FF00FF',
        'neon-blue': '0 0 5px #00FFFF, 0 0 10px #00FFFF, 0 0 15px #00FFFF',
        'neon-green': '0 0 5px #39FF14, 0 0 10px #39FF14, 0 0 15px #39FF14',
        'neon-purple': '0 0 5px #BC13FE, 0 0 10px #BC13FE, 0 0 15px #BC13FE',
      },
    },
  },
  plugins: [],
}
