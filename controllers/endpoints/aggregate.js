
module.exports = function(msbotControllerComplex, restServer) {
  restServer.get('/hello/:name', respond);
  restServer.head('/hello/:name', respond);

  restServer.get('/echo/:name', function (req, res, next) {
    res.send(req.params);
    return next();
  });

  // For proactive messaging
  // curl -X POST -H "Content-Type: multipart/form-data;" -F "message=This is my message" http://localhost:8089/proactive
  restServer.post('/proactive', function create(req, res, next) {
    var message = req.body.message;
    var address = {
          channelId: 'skype',
          user: {
            id: '1d9VvOaHnUNzy5ljbPupZOXt9VSyFlOEigqorpBiJJDo',
            name: 'vinaynaik.h'
          },
          bot: {
            id: 'quest',
            name: 'quest-bot'
          },
          serviceUrl: 'https://skype.botframework.com',
          useAuth: false
        };

        var address2 = {
          id: '1526582390281',
          channelId: 'skype',
          user: {
            id: '29:1d9VvOaHnUNzy5ljbPupZOXt9VSyFlOEigqorpBiJJDo',
            name: 'Vinay Naik'
          },
          conversation: {
            id: '29:1d9VvOaHnUNzy5ljbPupZOXt9VSyFlOEigqorpBiJJDo'
          },
          bot: {
            id: '28:87f7bec1-3ca5-4c02-9fc6-1a1fa5aaa520',
            name: 'Quest'
          },
          serviceUrl: 'https://smba.trafficmanager.net/apis/'
        };

        console.log("trumpet says");
        //console.log(msbotControllerComplex.bot);
        msbotControllerComplex.bot.say(
          {
            text: message,
            address: address2
          }
        );

        console.log("trumpet says over");

  	res.send(200, 'received');
    next();
  });

  function respond(req, res, next) {
    res.send('hello ' + req.params.name);
    next();
  }
}
