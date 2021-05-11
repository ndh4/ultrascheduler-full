module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'primary-teal': '#1DC2C4',
        'secondary-teal': '#149FA0',
        'primary-grey': '#898E91',
        'primary-black': '#4D5052',
        'primary-purple': '#201DC4',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
