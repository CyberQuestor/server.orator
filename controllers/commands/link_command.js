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

  let postURL = process.env.haystack_application_url + '/oauth2/otp';
  let postHeaders = headers: {
        'Content-Type': 'multipart/form-data'
    };
  let postBody = {
    'activationTracker': {
      'requestedBy': message.address.channelId,
      'activationCode': activationCode
    },
    'userAlias': message.user,
    'prefix': JSON.stringify(storagePrefix),
    'type': aliasType
  }

  let postFormData = {
    'userName': primaryEmail,
    'otp': activationCode,
    'alias': message.user,
    'channel': aliasType,
    'prefix': JSON.stringify(storagePrefix)
  };

    command_request.post({
  		url: postURL,
      headers: postHeaders,
      method: 'POST',
      formData: postFormData
  	}, function postComplete(error, response, body) {
  		if (error || response.statusCode !== 200) {
        bot.reply(message, 'Unable to complete linking. Make sure you copied the right OTP link phrase and it is not expired.');
    		return;
      }
  		try {
        // user toke
        // body is already object, no need for JSON.parse(body);

        // valid token available but consumer should ideally notify user

  		} catch(e) {
  			bot.reply(message, 'Unable to complete linking. Make sure you copied the right OTP and it is not expired.');
  		}
  	});

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
