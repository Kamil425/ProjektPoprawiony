import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      'primary': '#ECECE8',
      'secondary': '#3B3B3B',
      'three': '#FCC822',
      'four': '#E0E0E0',
      'white': '#FFFFFF',
<<<<<<< Updated upstream
      'green': '#33cc33',
=======


      'green': '#33cc33',
      'red':'#B30000'

>>>>>>> Stashed changes
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config
