module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      // fontFamily: {
      //   sans: ['Acari Sans']
      // },
      colors:{
        green:{
          100: "#149fa0"
        },
        blue:{
          100: "#F7FFFF"
        },
        teal:{
          100: "#1DC2C4"
        }
      }
    }

  },
  variants: {
    extend: {},
  },
  plugins: [],
}
