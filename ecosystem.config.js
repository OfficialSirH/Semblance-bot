module.exports = {
    apps: [{
        name: 'Semblance',
        script: './dist/index.js',
        watch: true,
        instances: '1',
        env: {
            NODE_ENV: "development"
        },
        env_production: {
            NODE_ENV: "production"
        }
    }],

  deploy : {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'https://github.com/OfficialSirH/Semblance-bot.git',
      path : './',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && tsc && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
