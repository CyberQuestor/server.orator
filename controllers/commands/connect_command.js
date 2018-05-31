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

  let aliasType = 'SkypeBotLink';
  if(message.address && message.address.channelId) {
    switch(message.address.channelId){
      case 'skype':
      aliasType = 'SkypeBotLink';
      break;
      default:
      aliasType = '';
      break;
    }
  }

  if(!aliasType) {
    respondUnsupported(bot, message);
    return;
  }

  let haystackUserId = getHaystackUserId(message);
  if(!haystackUserId) {
    respondNotLinked(bot, message);
  }

  let possibleFriends = [];
  let friendToAdd = {};
  friendToAdd.primaryEmail = friendsAlias;
  possibleFriends.push(friendToAdd);

  let postURL = process.env.haystack_orator_bot_application_url + '/checkout/' + haystackUserId + '/mynetwork';
  let postBody = JSON.stringify(possibleFriends);

    command_request.post({
  		url: postURL,
      method: 'POST',
      json: possibleFriends
  	}, function postComplete(error, response, body) {
  		if (error || response.statusCode !== 200) {
        respondUnableToConnect(bot, message);
    		return;
      }
  		try {
        // user profile
        // body is already object, no need for JSON.parse(body);
  			bot.reply(message, 'You are now connected with' + friendsAlias + 'at Haystack.One');

  		} catch(e) {
  			respondUnableToConnect(bot, message);
  		}
  	});

    // responds with not linked text
    function respondUnableToConnect(bot, message) {
      bot.reply(message, {
        type: "typing"
      });

      bot.reply(message, 'Unable to connect. You can try adding at Haystack.One');
    }

    // responds with usage text
    function respondUsage(bot, message) {
      bot.reply(message, {
        type: "typing"
      });

      bot.reply(message, 'Usage: !connect with [alias]');
    }

    // responds with usage text
    function respondUnsupported(bot, message) {
      bot.reply(message, {
        type: "typing"
      });

      bot.reply(message, 'This channel is not yet supported.');
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

      bot.reply(message, 'It appears that you are not linked yet. Visit Haystack.One to link to this channel.');
    }

};