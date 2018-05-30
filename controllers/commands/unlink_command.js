const command_request = require('request');
const command_util = require('util');

// This function will be run whenever link command is accessed
module.exports = function linkCommand (msbotController, bot, message, arguments) {
	// Bot code here - check command structure
  let haystackWord = arguments[0];

  if (!haystackWord) {
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

  let postURL = process.env.haystack_orator_bot_application_url + '/checkout/' + haystackUserId + '/alias/' + message.address.user.id;

    command_request.delete({
  		url: postURL,
      method: 'DELETE'
  	}, function deleteComplete(error, response, body) {
  		if (error || response.statusCode !== 200) {
        respondUnableToLink(bot, message);
    		return;
      }
  		try {
        let unlinkModule = require(__dirname + '/../providers/unlink_provider.js');
        unlinkModule(msbotController, bot, message.address);
  		} catch(e) {
  			respondUnableToLink(bot, message);
  		}
  	});

    // add user record in to DB
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

      bot.reply(message, 'Usage: !unlink haystack');
    }

    // responds with not linked text
    function respondNotLinked(bot, message) {
      bot.reply(message, {
        type: "typing"
      });

      bot.reply(message, 'It appears that you are not linked yet. Visit Haystack.One to link to this channel.');
    }

    // responds with not linked text
    function respondUnableToLink(bot, message) {
      bot.reply(message, {
        type: "typing"
      });

      bot.reply(message, 'Unable to complete unlinking. If issue persists, you can remove HOB from your contact list.');
    }

};
