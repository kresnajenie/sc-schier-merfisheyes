const { defineConfig } = require('vite')

module.exports = defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        filters: './src/ui/Filters/filters.html',
        navbar: './src/ui/Navbar/navbar.html',
        showing: './src/ui/Showing/showing.html',
        colorBar: './src/ui/ColorBar/colorBar.html',
      }
    }
  }
})