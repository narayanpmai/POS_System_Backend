// ecosystem.config.cjs
module.exports = {
  apps: [
    {
      name: "koselighar-dev",
      script: "dist/src/main.js",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      watch: false,
      autorestart: true,
      max_memory_restart: "1G",

      env: {
        NODE_ENV: "development",
        APP_ENV: "development",
      },

      error_file: "/home/beingonam/.pm2/logs/koselighar-dev-error.log",
      out_file: "/home/beingonam/.pm2/logs/koselighar-dev-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    },
  ],
};
