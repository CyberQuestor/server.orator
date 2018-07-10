/*User link endpoint*/
module.exports = function userLinkEndpoint(msbotControllerComplex, restServer) {

  // For user connect notification
  restServer.post('/trumpet/channel/link', function userLink(req, res, next) {
    console.log("userLinkEndpoint endpoint hit");
    let locale = res.getHeader('locale');
    let linkModule = require(__dirname + '/../providers/link_provider.js');
    linkModule(msbotControllerComplex.controller, msbotControllerComplex.bot, req.body, locale);

  	res.send(200, 'linked');
    next();
  });

}
