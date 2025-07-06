const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:4200", // ton frontend
    env: {
      apiUrl: "http://localhost:8081" // ton backend
    },
    setupNodeEvents(on, config) {
      // plugins éventuels
    }
  }
});
