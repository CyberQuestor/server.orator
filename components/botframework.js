// Now comes msbot layer
/**
 * Module Dependencies
 */
 const msBotkit = require('botkit');
 const os = require('os');
 const commandLineArgs = require('command-line-args');
 const localtunnel = require('localtunnel');
 const express = require('express');
 const bodyParser = require('body-parser');
 const http = require('http');
 const i18n = require(__dirname + '/../utilities/interpreter/i18nalternatives.js');

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

   var bot_options = {
       replyWithTyping: true,
       debug: true
   };

   // Use a redis database if specified, otherwise store in a JSON file local to the app.
   if (process.env.haystack_orator_redis_activate && process.env.haystack_orator_redis_activate !== 'false') {
     // create a custom db access method
     var db = require(__dirname + '/database.js')({namespace: process.env.haystack_orator_botframework_redis_namespace});
     bot_options.storage = db;
   } else {
       bot_options.json_file_store = __dirname + '/../.data/db/'; // store user data in a simple JSON format
   }

   if (process.env.msbothostname) {
     bot_options.hostname = process.env.msbothostname;
   }

   var controller = msBotkit.botframeworkbot(bot_options);

  var bot = controller.spawn({
    //appId: process.env.msbot_app_id,
    //appPassword: process.env.msbot_app_password
    appId: process.env.haystack_orator_microsoft_bot_channel_app_id,
    appPassword: process.env.haystack_orator_microsoft_bot_channel_app_secret
  });

  // setup alterntives support
  bot.i18n = i18n.fetchi18n();

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
