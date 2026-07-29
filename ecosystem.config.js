module.exports = {
  apps: [
    {
      name: "smartpos-backend",
      script: "dist/src/main.js",
      env: {
        NODE_ENV: "production",
        PORT: "5001"
      }
    }
  ]
};
