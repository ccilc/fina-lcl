const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8080,
    proxy: {
      "/api": {
        target: process.env.VUE_APP_API_TARGET || "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
});
