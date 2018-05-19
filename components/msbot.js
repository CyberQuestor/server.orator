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

/*controller.hears(['hello', 'hi'], 'message_received', function(bot, message) {

    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            bot.reply(message, 'Hello ' + user.name + '!!');
        } else {
            bot.reply(message, 'Hello.', function(err) {

              console.error(err);
            });
        }
    });
});

controller.hears(['call me (.*)'], 'message_received', function(bot, message) {
    var matches = message.text.match(/call me (.*)/i);
    var name = matches[1];
    controller.storage.users.get(message.user, function(err, user) {
        if (!user) {
            user = {
                id: message.user,
            };
        }
        user.name = name;
        controller.storage.users.save(user, function(err, id) {
            bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.');
        });
    });
});


controller.hears(['what is my name', 'who am i'], 'message_received', function(bot, message) {

    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            bot.reply(message,'Your name is ' + user.name);
        } else {
            bot.reply(message,'I don\'t know yet!');
        }
    });
});

controller.hears(['shutdown'],'message_received',function(bot, message) {

    bot.startConversation(message,function(err, convo) {
        convo.ask('Are you sure you want me to shutdown?',[
            {
                pattern: bot.utterances.yes,
                callback: function(response, convo) {
                    convo.say('Bye!');
                    convo.next();
                    setTimeout(function() {
                        process.exit();
                    },3000);
                }
            },
        {
            pattern: bot.utterances.no,
            default: true,
            callback: function(response, convo) {
                convo.say('*Phew!*');
                convo.next();
            }
        }
        ]);
    });
});

controller.hears(['uptime','identify yourself','who are you','what is your name'],'message_received',function(bot, message) {

    var hostname = os.hostname();
    var uptime = formatUptime(process.uptime());

    bot.reply(message,'I am a bot! I have been running for ' + uptime + ' on ' + hostname + '.');

});

function formatUptime(uptime) {
    var unit = 'second';
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'minute';
    }
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'hour';
    }
    if (uptime != 1) {
        unit = unit + 's';
    }

    uptime = uptime + ' ' + unit;
    return uptime;
}*/

return {controller: controller, bot: bot}

}