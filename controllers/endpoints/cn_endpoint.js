const logger = reqlib('/utilities/interpreter/logger.js').fetchLogger(__dirname + __filename);
const ResponseCode = reqlib('/utilities/interpreter/rode.js').fetchResponseCode();

/*Common text-only notifications endpoint*/
module.exports = function commonNotificationEndpoint(msbotControllerComplex, restServer) {

  // For user connect notification
  restServer.post('/trumpet/channel/cn', function commonNotification(req, res, next) {
    logger.silly("common notification endpoint hit");
    let locale = res.getHeader('locale');
    let ucnModule = require(__dirname + '/../providers/cn_provider.js');
    ucnModule(msbotControllerComplex.controller, msbotControllerComplex.bot, req.body, locale);

  	res.send(200, 'notified');
    next();
  });

}
