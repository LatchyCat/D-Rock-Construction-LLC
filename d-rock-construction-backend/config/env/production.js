module.exports = {
    datastores: {
      default: {
        ssl: true
      }
    },
    models: {
      migrate: 'safe'
    },
    security: {
      cors: {
        allowOrigins: ['https://your-production-domain.com']
      }
    }
  };
