var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'boilerplate'
    },
    port: 3000,
    db: 'mongodb://localhost/boilerplate-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'boilerplate'
    },
    port: 3000,
    db: 'mongodb://localhost/boilerplate-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'boilerplate'
    },
    port: 3000,
    db: 'mongodb://localhost/boilerplate-production'
  }
};

module.exports = config[env];
