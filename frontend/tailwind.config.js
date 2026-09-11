/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Clinical theme for Login
        clinical: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#0b5748',
          850: '#084c3e',
          900: '#064236',
          950: '#032c24',
        },
        brand: {
          dark: '#084c3e',
          accent: '#0d9488',
          subtle: '#0f766e',
        },
        // Design system colors for Student Dashboard
        "primary": "#004c4c",
        "primary-container": "#006666",
        "on-primary-container": "#93e1e0",
        "on-primary": "#ffffff",
        "surface": "#f7faf9",
        "surface-container-low": "#f1f4f3",
        "surface-container": "#ebeeed",
        "surface-container-high": "#e6e9e8",
        "surface-container-highest": "#e0e3e2",
        "surface-container-lowest": "#ffffff",
        "on-surface": "#181c1c",
        "on-surface-variant": "#3f4948",
        "outline": "#6f7979",
        "outline-variant": "#bec9c8",
        "tertiary": "#004c49",
        "tertiary-container": "#006662",
        "on-tertiary-container": "#77e5de",
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
        headline: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'clinical-card': '0 20px 45px -15px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
