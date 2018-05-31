const command_request = require('request');

// This function will be run whenever link command is accessed
module.exports = function linkCommand (msbotController, bot, message, arguments) {
	// Bot code here - check command structure
  let primaryEmail = arguments[0];
  let withWord = arguments[1];
  let otpWord = arguments[2];
  let activationCode = arguments[3];

  if (!primaryEmail || !withWord || !otpWord || !activationCode) {
    respondUsage(bot, message);
    return;
  }

  primaryEmail = primaryEmail.toLowerCase();
  withWord = withWord.toLowerCase();
  otpWord = otpWord.toLowerCase();

  if (primaryEmail === 'help' || withWord !== 'with' || otpWord !== 'otp') {
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

  let storagePrefix = {};
  storagePrefix.address = message.address;
  storagePrefix.user=message.user;

  let postURL = process.env.haystack_orator_bot_application_url + '/checkout/' + primaryEmail + '/alias';
  let postHeaders = {'Content-Type' : 'application/json'}
  let postBody = {
    'activationTracker': {
      'requestedBy': message.address.channelId,
      'activationCode': activationCode
    },
    'userAlias': message.user,
    'prefix': JSON.stringify(storagePrefix),
    'type': aliasType
  }

    command_request.post({
  		url: postURL,
      method: 'POST',
      json: postBody
  	}, function postComplete(error, response, body) {
  		if (error || response.statusCode !== 200) {
        bot.reply(message, 'Unable to complete linking. Make sure you copied the right OTP link phrase and it is not expired.');
    		return;
      }
  		try {
        // user profile
        // body is already object, no need for JSON.parse(body);
        bot.reply(message, 'Welcome' + body.firstName + '!');
  			bot.reply(message, 'Link has been established successfully. You will now receive notifications on this channel.');

        // time to update redis records
        injectUserData(message, body);
  		} catch(e) {
  			bot.reply(message, 'Unable to complete linking. Make sure you copied the right OTP and it is not expired.');
  		}
  	});

    // add user record in to DB
    function injectUserData(message, haystackUserData) {
      var userRecord = msbotController.storage.users.get(message.user, function fetchUser(error, user){
        if (!user) {
          user = {
            id: message.user,
            haystack_id: haystackUserData.userId,
            linked_to_haystack: true
          };
        } else {
          user.linked_to_haystack = true;
          user.haystack_id = haystackUserData.userId;
        }

        msbotController.storage.users.save(user, function(err, id) {});
      });
    }

    // responds with usage text
    function respondUsage(bot, message) {
      bot.reply(message, {
        type: "typing"
      });

      bot.reply(message, 'Usage: !link [primary_email] with OTP [generated_otp]');
    }

    // responds with usage text
    function respondUnsupported(bot, message) {
      bot.reply(message, {
        type: "typing"
      });

      bot.reply(message, 'This channel is not yet supported.');
    }

};