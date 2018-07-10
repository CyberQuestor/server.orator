// Now comes the restful layer
/**
 * Module Dependencies
 */
var restify = require('restify');


module.exports = function(msbotControllerComplex) {
  /**
   * Initialize Server
   */
  var restServer = restify.createServer({
    name: 'trumpet',
    version: '1.1.1.0'
  });

  restServer.listen(8089, function() {
    console.log('%s listening at %s', restServer.name, restServer.url);
  });

  /**
   * Bundled Plugins (http://restify.com/#bundled-plugins)
   */
  //restServer.use(restify.plugins.jsonBodyParser({ mapParams: true }));
  restServer.use(restify.plugins.acceptParser(restServer.acceptable));
  restServer.use(restify.plugins.queryParser());
  restServer.use(restify.plugins.bodyParser());

  restServer.use((req, res, next) => {
    res.header('locale', "en");
    return next();
});



  var normalizedPath = require("path").join(__dirname, "/../controllers/endpoints");
  require("fs").readdirSync(normalizedPath).forEach(function(file) {
    require("./../controllers/endpoints/" + file)(msbotControllerComplex, restServer);
  });

  return restServer;
}
