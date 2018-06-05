/*User link endpoint*/
module.exports = function userLinkEndpoint(msbotControllerComplex, restServer) {

  // For user connect notification
  restServer.post('/trumpet/channel/link', function userLink(req, res, next) {
    console.log("userLinkEndpoint endpoint hit");
    let linkModule = require(__dirname + '/../providers/link_provider.js');
    linkModule(msbotControllerComplex.controller, msbotControllerComplex.bot, req.body);

  	res.send(200, 'linked');
    next();
  });

}
