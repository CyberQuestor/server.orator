const logger = reqlib('/utilities/interpreter/logger.js').fetchLogger(__dirname + __filename);

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise ' + p + ' reason: ' + reason);
  logger.error('Unhandled Rejection at: Promise ' + p + ' reason: ' + reason, reason);
  // application specific logging, throwing an error, or other logic here
});

process.on('uncaughtException', function (err) {
  console.log(err);
  logger.error('Something went uncaught!', err);
  // do not stop it from crumbling
  process.exit(1);
})
