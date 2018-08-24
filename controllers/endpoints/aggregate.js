const endpoint_exec = require('child_process').exec;

module.exports = function(msbotControllerComplex, restServer) {

  restServer.get('/trumpet/decode', function (req, res, next) {

    /*let crpModule = require(__dirname + '/../providers/crf_provider.js');
    let storageComplex = {};
    storageComplex.requestOptions = {};
    storageComplex.requestOptions.uri = process.env.haystack_application_url + '/profiles/skype:29:1d9VvOaHnUNzy5ljbPupZOXt9VSyFlOEigqorpBiJJDo';
    storageComplex.tokenHandle = "skype:29:1d9VvOaHnUNzy5ljbPupZOXt9VSyFlOEigqorpBiJJDo"
    storageComplex.requestOptions.headers = {
        'Accept': 'application/json'
      };
    storageComplex.requestOptions.method = 'GET';
    storageComplex.requestCb = function (error, response, body) {
      console.log('final call');
      console.log(body);
    }

    crpModule(storageComplex);*/

    res.send(200, 'aggregate');
    return next();
  });
}
