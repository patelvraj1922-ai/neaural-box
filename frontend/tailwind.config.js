/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            color: '#94a3b8', // slate-400
            strong: {
              color: '#f8fafc', // slate-50
            },
            h1: {
              color: '#22d3ee', // cyan-400
            },
            h2: {
              color: '#818cf8', // indigo-400
            },
            h3: {
              color: '#c084fc', // purple-400
            },
            th: {
              color: '#e2e8f0', // slate-200
            },
            a: {
              color: '#38bdf8', // sky-400
              '&:hover': {
                color: '#0ea5e9',
              },
            },
            code: {
              color: '#f472b6', // pink-400
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}