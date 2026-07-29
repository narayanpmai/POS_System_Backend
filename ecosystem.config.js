module.exports = {
  apps: [
    {
      name: "koselighar-backend",
      script: "dist/src/main.js",
      env: {
        NODE_ENV: "production",
        PORT: "5001"
      }
    }
  ]
};
