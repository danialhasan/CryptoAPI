module.exports = {
  purge: {
    // '/views/404.ejs',
    enabled: true,
    content: [
      'views/dashboard.ejs',
      'views/index.ejs',
      'views/layout.ejs',
      // '/views/users.ejs',
    ]
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}