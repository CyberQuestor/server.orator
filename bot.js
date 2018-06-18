// Set all your environment variables
const environment = require(__dirname + '/utilities/interpreter/environment.js');
const unhandled = require(__dirname + '/utilities/interpreter/unhandled.js');
const access = require(__dirname + '/utilities/interpreter/access.js');

var Botkit = require('botkit');
var debug = require('debug')('botkit:main');

var bot_options = {
    studio_token: process.env.studio_token,
    studio_command_uri: process.env.studio_command_uri,
    studio_stats_uri: process.env.studio_command_uri,
    replyWithTyping: true,
};

// Use a redis database if specified, otherwise store in a JSON file local to the app.
if (process.env.haystack_orator_redis_activate && process.env.haystack_orator_redis_activate !== 'false') {
  // create a custom db access method
  var db = require(__dirname + '/components/database.js')({});
  bot_options.storage = db;
} else {
    bot_options.json_file_store = __dirname + '/.data/db/'; // store user data in a simple JSON format
}

// Create the Botkit controller, which controls all instances of the bot.
var controller = Botkit.socketbot(bot_options);

// Set up an Express-powered webserver to expose oauth and webhook endpoints
var webserver = require(__dirname + '/components/express_webserver.js')(controller);

// Set up bot framework for extended reach
var msbotControllerComplex = require(__dirname + '/components/botframework.js')();

// Set up restify-powered server to expose Haystack facing endpoints
var restServer = require(__dirname + '/components/trumpet.js')(msbotControllerComplex);



// Load in some helpers that make running Botkit on Glitch.com better -- not required, self hosted
//require(__dirname + '/components/plugin_glitch.js')(controller);

// Load in a plugin that defines the bot's identity
require(__dirname + '/components/plugin_identity.js')(controller);
// Load in a plugin that defines the bot's identity
require(__dirname + '/components/plugin_identity.js')(msbotControllerComplex.controller);

// enable advanced botkit studio metrics
// and capture the metrics API to use with the identity plugin!
controller.metrics = require('botkit-studio-metrics')(controller);

// Open the web socket server
controller.openSocketServer(controller.httpserver);

// Start the bot brain in motion!!
controller.startTicking();


var normalizedPath = require("path").join(__dirname, "controllers/skills/web");
require("fs").readdirSync(normalizedPath).forEach(function(file) {
  require("./controllers/skills/web/" + file)(controller);
});
var normalizedPath = require("path").join(__dirname, "controllers/skills/botframework");
require("fs").readdirSync(normalizedPath).forEach(function(file) {
  require("./controllers/skills/botframework/" + file)(msbotControllerComplex.controller);
});

console.log('I AM ONLINE! COME TALK TO ME: http://localhost:' + (process.env.PORT || 3000))

// This captures and evaluates any message sent to the bot as a DM
// or sent to the bot in the form "@bot message" and passes it to
// Botkit Studio to evaluate for trigger words and patterns.
// If a trigger is matched, the conversation will automatically fire!
// You can tie into the execution of the script using the functions
// controller.studio.before, controller.studio.after and controller.studio.validate
if (process.env.studio_token) {
    controller.on('message_received', function(bot, message) {
        controller.studio.runTrigger(bot, message.text, message.user, message.channel, message).then(function(convo) {
            if (!convo) {
              // web bot requires a response of some kind!
              bot.reply(message,'OK');

                // no trigger was matched
                // If you want your bot to respond to every message,
                // define a 'fallback' script in Botkit Studio
                // and uncomment the line below.
                // controller.studio.run(bot, 'fallback', message.user, message.channel, message);
            } else {
                // set variables here that are needed for EVERY script
                // use controller.studio.before('script') to set variables specific to a script
                convo.setVar('current_time', new Date());
                convo.setVar('bot', controller.studio_identity);
            }
        }).catch(function(err) {
            bot.reply(message, 'I experienced an error with a request to Botkit Studio: ' + err);
            debug('Botkit Studio: ', err);
        });
    });
} else {

    console.log('~~~~~~~~~~');
    console.log('NOTE: Botkit Studio functionality has not been utilized');
    console.log('If we decide to use later, pass in a studio_token parameter with a token from https://studio.botkit.ai/');
}
