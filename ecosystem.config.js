module.exports = {
  apps : [
    {
      name: "smartpos-backend",
      cwd: "./backend",
      script: "dist/src/main.js",
      env: {
        NODE_ENV: "production"
      }
    },
    {
      name: "smartpos-frontend",
      cwd: "./frontend",
      script: ".next/standalone/server.js",
      env: {
        NODE_ENV: "production",
        PORT: "3001"
      }
    }
  ]
}
