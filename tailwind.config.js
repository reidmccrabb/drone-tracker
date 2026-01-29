/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        drone: {
          airborne: '#00ff88',
          ground: '#888888',
          emergency: '#ff4444',
          warning: '#ffaa00',
        },
      },
    },
  },
  plugins: [],
}
