/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: '#050505',
        surface: '#121212',
        surfaceHover: '#1c1c1c',
        muted: '#888888',
        brand: '#ff4d00', // Electric orange
        brandMuted: 'rgba(255, 77, 0, 0.15)',
        textMain: '#ffffff',
        textMuted: '#a0a0a0',
        borderRoot: '#222222',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
}

