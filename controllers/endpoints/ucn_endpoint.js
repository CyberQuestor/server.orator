/*User connection notification endpoint*/
module.exports = function userConnectNotificationEndpoint(msbotControllerComplex, restServer) {

  // For user connect notification
  restServer.post('/trumpet/channel/ucn', function userConnectNotification(req, res, next) {
    console.log("userConnectNotification endpoint hit");
    let ucnModule = require(__dirname + '/../providers/ucn_provider.js');
    ucnModule(msbotControllerComplex.controller, msbotControllerComplex.bot, req.body);

  	res.send(200, 'connected');
    next();
  });

}
