const command_request = require('request');

// This function will be run whenever connect command is accessed
// Usage: !connect with [alias]
module.exports = function connectCommand (msbotController, bot, message, arguments) {
	// Bot code here - check command structure
  let withWord = arguments[0];
  let friendsAlias = arguments[1];

  if (!friendsAlias || !withWord) {
    respondUsage(bot, message);
    return;
  }

  withWord = withWord.toLowerCase();
  friendsAlias = friendsAlias.toLowerCase();

  if (withWord === 'help') {
    respondUsage(bot, message);
		return;
	}

  if (withWord !== 'with') {
    respondUsage(bot, message);
		return;
	}

  let haystackUserId = getHaystackUserId(message);
  if(!haystackUserId) {
    respondNotLinked(bot, message);
    return;
  }

  let possibleFriends = [];
  let friendToAdd = {};
  friendToAdd.primaryEmail = friendsAlias;
  possibleFriends.push(friendToAdd);

  getBearer(message, postConnect);

  function getBearer(message, cb){
    let request_cache_module = require(__dirname + '/../../components/request_cache.js')();
    request_cache_module.get(message.user + "_access", cb);
    request_cache_module.quit();
  }

  function postConnect(err, result) {
    if(err) {
      console.log(err);
      respondNotLinked(bot, message);
      return;
    }

    if(!result) {
      respondNotLinked(bot, message);
      return;
    }

    let postURL = process.env.haystack_orator_bot_application_url + '/checkout/' + haystackUserId + '/mynetwork';
    let postBody = JSON.stringify(possibleFriends);
    let postBearer = 'Bearer ' + result;

    let postHeaders = {
        'Accept': 'application/json',
        'Authorization': postBearer
      };

    command_request.post({
      url: postURL,
      method: 'POST',
      headers: postHeaders,
      json: possibleFriends
    }, function postComplete(error, response, body) {
      if (error || response.statusCode !== 200) {
        respondUnableToConnect(bot, message);
        return;
      }
      try {
        // user profile
        // body is already object, no need for JSON.parse(body);
        bot.reply(message, bot.i18n.__({phrase:'connect_command_now_connected', locale:message.haystack_locale}, friendsAlias));

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

      bot.reply(message, bot.i18n.__({phrase:'connect_command_respond_unable_to_connect', locale:message.haystack_locale}));
    }

    // responds with usage text
    function respondUsage(bot, message) {
      bot.reply(message, {
        type: "typing"
      });

      bot.reply(message, bot.i18n.__({phrase:'connect_command_respond_usage', locale:message.haystack_locale}));
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
        return message.haystack_data.haystack_id;
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
