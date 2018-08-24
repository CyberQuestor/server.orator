const command_request = require('request');

// This function will be run whenever connect command is accessed
// Usage: !profile haystack
module.exports = function connectCommand (msbotController, bot, message, arguments) {
	// Bot code here - check command structure
  let haystackWord = arguments[0];

  if (!haystackWord || haystackWord !== 'haystack' ) {
    respondUsage(bot, message);
    return;
  }

  haystackWord = haystackWord.toLowerCase();

  if (haystackWord === 'help') {
    respondUsage(bot, message);
		return;
	}

  let haystackUserId = getHaystackUserId(message);
  if(!haystackUserId) {
    respondNotLinked(bot, message);
    return;
  }

  getBearer(message, getProfile);

  function getBearer(message, cb){
    let request_cache_module = require(__dirname + '/../../components/request_cache.js')();
    request_cache_module.get(message.user + "_access", cb);
    request_cache_module.quit();
  }

  function getProfile(err, result) {
    if(err) {
      console.log(err);
      respondNotLinked(bot, message);
      return;
    }

    if(!result) {
      respondNotLinked(bot, message);
      return;
    }

    let storageComplex = {};
    storageComplex.requestOptions = {};
    storageComplex.requestOptions.uri = process.env.haystack_application_url + '/profiles/' + haystackUserId;
    let postBearer = 'Bearer ' + result;

    storageComplex.requestOptions.headers = {
        'Accept': 'application/json',
        'Authorization': postBearer
      };

      storageComplex.requestOptions.headers.method = 'GET';

    command_request.get(storageComplex.requestOptions, function postComplete(error, response, body) {
      if (error || response.statusCode !== 200) {
        respondUnableToConnect(bot, message);
        return;
      }
      try {
        // user profile
        // body is already object, no need for JSON.parse(body);
        let parsedBody = JSON.parse(body);
        bot.reply(message, "I found your name as: " + parsedBody.firstName + parsedBody.lastName);

      } catch(e) {
        respondUnableToConnect(bot, message);
      }
    });
  }

    // responds with not linked text
    function respondUnableToConnect(bot, message) {
      bot.reply(message, {
        type: "typing"
      });

      bot.reply(message, "no profile!");
    }

    // responds with usage text
    function respondUsage(bot, message) {
      bot.reply(message, {
        type: "typing"
      });

      bot.reply(message, "Usage: !showprofilename haystack");
    }

    // responds with usage text
    function respondUnsupported(bot, message) {
      bot.reply(message, {
        type: "typing"
      });

      bot.reply(message, bot.i18n.__({phrase:'connect_command_respond_unsupported', locale:message.haystack_locale}));
    }

    // add user record in to DB
    function getHaystackUserId(message) {
      if(message.haystack_data) {
        return message.haystack_data.id;
      }
    }

    // responds with not linked text
    function respondNotLinked(bot, message) {
      bot.reply(message, {
        type: "typing"
      });

      bot.reply(message, bot.i18n.__({phrase:'connect_command_respond_not_linked', locale:message.haystack_locale}));
    }

};
