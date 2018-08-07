// Now comes the restful layer
/**
 * Module Dependencies
 */
var restify = require('restify');
var errs = require('restify-errors');
const logger = reqlib('/utilities/interpreter/logger.js').fetchLogger(__dirname + __filename);
const ResponseCode = reqlib('/utilities/interpreter/rode.js').fetchResponseCode();

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

  restServer.use(restify.plugins.authorizationParser());
  restServer.use(function (req, res, next) {
    let username = process.env.haystack_orator_trumpet_user;
    let password = process.env.trumpsec;

    // Ensure that user is not anonymous, user exists; and
    // that user password matches the record
    if (req.username == 'anonymous' || username !== req.username || req.authorization.basic.password !== password) {
        // Respond with { code: 'NotAuthorized', message: '' }
        next(new errs.InvalidCredentialsError('You are not playing by rules!'));
        logger.debug(ResponseCode.InvalidCredentialsException, errs.InvalidCredentialsError);
    } else {
        next();
    }

    //next();
  });



  var normalizedPath = require("path").join(__dirname, "/../controllers/endpoints");
  require("fs").readdirSync(normalizedPath).forEach(function(file) {
    require("./../controllers/endpoints/" + file)(msbotControllerComplex, restServer);
  });

  return restServer;
}
