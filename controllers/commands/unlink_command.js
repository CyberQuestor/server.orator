const command_request = require('request');
const command_util = require('util');

const logger = reqlib('/utilities/interpreter/logger.js').fetchLogger(__dirname + __filename);
const ResponseCode = reqlib('/utilities/interpreter/rode.js').fetchResponseCode();

// This function will be run whenever link command is accessed
module.exports = function unlinkCommand (msbotController, bot, message, arguments) {
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
  }

getBearer(message, deleteUnlink);

function getBearer(message, cb){
  let request_cache_module = require(__dirname + '/../../components/request_cache.js')();
  request_cache_module.get(message.user + "_access", cb);
  request_cache_module.quit();
}

function deleteUnlink(err, result) {

  let commonProvider = require(__dirname + '/../providers/common_provider.js');

  if(err) {
    console.log(err);
    commonProvider.respondNotLinked(bot, message);
    return;
  }

  if(!result) {
    commonProvider.respondNotLinked(bot, message);
    return;
  }

  logger.silly("And the token for unlinking would be: " + result);

  let postURL = process.env.haystack_orator_bot_application_url + '/checkout/' + haystackUserId + '/alias/' + message.user;
  let postBearer = 'Bearer ' + result;

  let postHeaders = {
      'Accept': 'application/json',
      'Authorization': postBearer
    };

    command_request.delete({
  		url: postURL,
      method: 'DELETE',
      headers: postHeaders
  	}, function deleteComplete(error, response, body) {
  		if (error || response.statusCode !== 200) {
        respondUnableToLink(bot, message);
    		return;
      }
  		try {
        // this will be handled by haystack
        let unlinkModule = require(__dirname + '/../providers/unlink_provider.js');
        let storagePrefix = {};
        storagePrefix.address = message.address;
        storagePrefix.user=message.user;
        storagePrefix.is_acknowledge = true;

        unlinkModule(msbotController, bot, storagePrefix, message.haystack_locale);
  		} catch(e) {
  			respondUnableToLink(bot, message);
  		}
  	});
  }

    // get user record from DB
    function getHaystackUserId(message) {
      if(message.haystack_data) {
        return message.haystack_data.haystack_id;
      }
    }

    // responds with usage text
    function respondUsage(bot, message) {
      bot.reply(message, {
        type: "typing"
      });

      bot.reply(message, bot.i18n.__({phrase:'unlink_command_respond_usage', locale:message.haystack_locale}));
    }

    // responds with not linked text
    function respondNotLinked(bot, message) {
      bot.reply(message, {
        type: "typing"
      });

      bot.reply(message, bot.i18n.__({phrase:'unlink_command_respond_not_linked', locale:message.haystack_locale}));
    }

    // responds with not linked text
    function respondUnableToLink(bot, message) {
      bot.reply(message, {
        type: "typing"
      });

      bot.reply(message, bot.i18n.__({phrase:'unlink_provider_parting_unable', locale:message.haystack_locale}));
    }

};
