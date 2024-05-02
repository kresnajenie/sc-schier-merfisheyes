const { defineConfig } = require('vite')

module.exports = defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        filters: './src/ui/Filters/filters.html',
        navbar: './src/ui/Navbar/navbar.html',
      }
    }
  }
})