/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      animation: {
        'meteor-effect': 'meteor-effect 1s linear infinite',
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'shoot': 'shoot 1s linear infinite',
        'aurora-1': 'aurora-1 20s ease-in-out infinite',
        'aurora-2': 'aurora-2 25s ease-in-out infinite reverse',
      },
    },
  },
  plugins: [],
}
