/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1F4E79',
          dark: '#153654',
          light: '#2d6fa8',
        },
        accent: {
          DEFAULT: '#27AE60',
          dark: '#1e8a4c',
          light: '#32cd71',
        },
        error: {
          DEFAULT: '#E74C3C',
          dark: '#c0392b',
          light: '#ea6153',
        },
        warning: {
          DEFAULT: '#F39C12',
          dark: '#d35400',
          light: '#f1c40f',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'mesh-gradient': "radial-gradient(at 40% 20%, hsla(213,82%,30%,0.12) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(143,68%,40%,0.08) 0px, transparent 50%), radial-gradient(at 0% 100%, hsla(213,82%,60%,0.06) 0px, transparent 50%)",
      },
    },
  },
  plugins: [],
}
