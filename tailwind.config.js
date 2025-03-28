/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#121212',
        surface: '#1E1E1E',
        primary: '#BB86FC',
        secondary: '#03DAC6',
        error: '#CF6679',
        success: '#4CAF50',
        warning: '#FB8C00',
        'on-background': '#FFFFFF',
        'on-surface': '#FFFFFF',
        'on-primary': '#000000',
        'on-secondary': '#000000',
      },
    },
  },
  plugins: [],
};