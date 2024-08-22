const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    experimentalSessionAndOrigin: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "http://localhost:5173", // Adjust this to your frontend URL
  },
  env: {
    apiUrl: "http://localhost:4000", // Adjust this to your backend API URL
  },
});
