
module.exports = function unlinkEndpoint(msbotControllerComplex, restServer) {

  // For unliniking messaging
  // curl -X POST -H "Content-Type: multipart/form-data;" -F "message=This is my message" http://localhost:8089/orator/unlink
  restServer.post('/orator/channel/unlink', function unlinkUser(req, res, next) {
    let unlinkModule = require(__dirname + '/../providers/unlink_provider.js');
    unlinkModule(msbotControllerComplex.controller, msbotControllerComplex.bot, req.body);

  	res.send(200, 'unlinked');
    next();
  });

}
