/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'], // Keep default sans stack
        nunito: ['"Nunito"', 'sans-serif'] // Add Nunito
      },
      colors: {
        primary: '#FFB5E8',    // Soft pink
        secondary: '#B5DEFF',  // Baby blue
        accent: '#AFF6D6',     // Mint green
        background: {
          light: '#F8F9FF',    // Soft white
          dark: '#2A2D3E'      // Gentle dark
        },
        methodology: '#FF5733'//'#7A7A8C'  // Lighter gray with slight blue tint
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'stars': "url('https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?auto=format&fit=crop&q=80')",
      }
    },
  },
  plugins: [
    // require("daisyui")
  ],
  daisyui: {
    themes: [
      {
        babymusic: {
          "primary": "#FFB5E8",
          "secondary": "#B5DEFF",
          "accent": "#AFF6D6",
          "neutral": "#2A2D3E",
          "base-100": "#F8F9FF",
          "info": "#3ABFF8",
          "success": "#36D399",
          "warning": "#FBBD23",
          "error": "#F87272",
        },
      },
      "light",
      "dark",
    ],
    darkTheme: "dark",
  },
};