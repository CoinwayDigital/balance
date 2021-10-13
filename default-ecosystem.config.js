// This file to ecosystem.config.js
module.exports = {
    apps : [{
        name   : "project-name",
        script : "./dist/index.js",
        env: {
            "ENVIRONMENT": "production",
            "DB_USER": "",
            "DB_PASSWORD": "",
            "DB_HOST": "",
            "DB_PORT": "",
            "DB_DATABASE": ""
        }
    }]
  }