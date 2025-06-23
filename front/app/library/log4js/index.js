const config = () => {
  // eslint-disable-next-line global-require
  const log4js = require('log4js');
  // eslint-disable-next-line global-require
  // require('pm2-intercom');
  log4js.configure({
    appenders: {
      browserError: {
        type: 'dateFile',
        filename: 'logs/error/exception',
        pattern: '.yyyy-MM-dd.log',
        alwaysIncludePattern: true,
        layout: {
          type: 'pattern',
          pattern: `%d{yyyy-MM-dd hh:mm:ss} [%-5p]%n%m%n`,
        },
        maxLogSize: 10485760,
      },
    },
    pm2: true,
    disableClustering: true,
    categories: {
      default: { appenders: ['browserError'], level: 'error' },
    },
  });
};

module.exports = { config };
