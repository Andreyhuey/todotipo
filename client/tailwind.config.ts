/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: {
      heading: 'var(--font-montserrat)',
      body: 'var(--font-inter)',
    },
    extend: {
      colors: {
        neutral: {
          50: '#f9fafb',
          75: '#f7f9fc',
          100: '#f0f2f5',
          200: '#e4e7ec',
          300: '#d0d5dd',
          400: '#98a2b3',
          500: '#667185',
          600: '#475367',
          700: '#344054',
          800: '#1d2739',
          900: '#101828',
          head: '#333333',
        },
        accent: {
          700: '#7a766c',
        },
      },
    },
    container: {
      center: true,
      padding: '1rem',
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1400px',
      },
    },
  },
  plugins: [],
};
