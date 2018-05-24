// Now comes msbot layer
/**
 * Module Dependencies
 */
 var msBotkit = require('botkit');
 var os = require('os');
 var commandLineArgs = require('command-line-args');
 var localtunnel = require('localtunnel');
 var express = require('express');
 var bodyParser = require('body-parser');
 var http = require('http');

module.exports = function() {
  const ops = commandLineArgs([
      {name: 'lt', alias: 'l', args: 1, description: 'Use localtunnel.me to make your bot available on the web.',
      type: Boolean, defaultValue: false},
      {name: 'ltsubdomain', alias: 's', args: 1,
      description: 'Custom subdomain for the localtunnel.me URL. This option can only be used together with --lt.',
      type: String, defaultValue: null},
   ]);

   if(ops.lt === false && ops.ltsubdomain !== null) {
       console.log("error: --ltsubdomain can only be used together with --lt.");
       process.exit();
   }

   var controller = msBotkit.botframeworkbot({
    debug: true
  });

  var bot = controller.spawn({
    //appId: process.env.msbot_app_id,
    //appPassword: process.env.msbot_app_password
    appId: '87f7bec1-3ca5-4c02-9fc6-1a1fa5aaa520',
    appPassword: 'owbwhNCO714}_bkQJGX87=)'
  });

  // try out setting express server
  /*var webserver = express();
  webserver.use(bodyParser.json());
  webserver.use(bodyParser.urlencoded({ extended: true }));
  webserver.use(express.static('public'));
  var server = http.createServer(webserver);
  server.listen(process.env.msbotport || 3050, null, function() {
      console.log('Express botframework server configured and listening at http://localhost:' + (process.env.msbotport || 3050));
  });

  controller.webserver = webserver;
  controller.httpserver = server;*/

  controller.setupWebserver(process.env.msbotport || 3050, function(err, webserver) {
    controller.createWebhookEndpoints(webserver, bot, function() {
        console.log('ONLINE!');
        if(ops.lt) {
            var tunnel = localtunnel(process.env.msbotport || 3050, {subdomain: ops.ltsubdomain}, function(err, tunnel) {
                if (err) {
                    console.log(err);
                    process.exit();
                }
                console.log("Your bot is available on the web at the following URL: " + tunnel.url + '/botframework/receive');
            });

            tunnel.on('close', function() {
                console.log("Your bot is no longer available on the web at the localtunnnel.me URL.");
                process.exit();
            });
        }
    });
  });

  var normalizedPath = require("path").join(__dirname, "/../controllers/middlewares");
  require("fs").readdirSync(normalizedPath).forEach(function(file) {
    require("./../controllers/middlewares/" + file)(controller, bot);
  });

return {controller: controller, bot: bot}

}
