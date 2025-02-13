/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FFB5E8',    // Soft pink
        secondary: '#B5DEFF',  // Baby blue
        accent: '#AFF6D6',     // Mint green
        background: {
          light: '#F8F9FF',    // Soft white
          dark: '#2A2D3E'      // Gentle dark
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'stars': "url('https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?auto=format&fit=crop&q=80')",
      }
    },
  },
  plugins: [],
};