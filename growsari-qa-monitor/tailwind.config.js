/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          primary: '#4CBFB1',
          dark: '#3AA89B',
          light: '#6ECEC2',
          muted: '#E8F8F6',
        },
        slate: {
          bg: '#0F1117',
          card: '#171B26',
          border: '#252A38',
          text: '#8B95A8',
        }
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      }
    },
  },
  plugins: [],
}
