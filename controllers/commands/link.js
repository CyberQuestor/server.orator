const command_request = require('request');

// This function will be run whenever link command is accessed
module.exports = function linkCommand (msbotController, bot, message, arguments) {
	// Bot code here
  let primaryEmail = arguments[0];
  primaryEmail = primaryEmail.toLowerCase();

  let withWord = arguments[1];
  withWord = withWord.toLowerCase();

  let otpWord = arguments[2];
  otpWord = otpWord.toLowerCase();

  let activationCode = arguments[3];

  if (!primaryEmail || !withWord || !otpWord
    || primaryEmail === 'help' || withWord !== 'with' || otpWord !== 'otp') {
    bot.reply(message, {
      type: "typing"
    });

    bot.say('Usage: !link [primary_email] with OTP [generated_otp]');
		return;
	}

  let postURL = process.env.haystack_orator_bot_application_url + '/checkout/' + primaryEmail + 'alias';
  let postHeaders = {'content-type' : 'application/json'}
  let postBody = {
    'activationTracker': {
      'requestCreatedBy': message.address.channelId,
      'activationCode': activationCode
    },
    'userAlias': message.address.user.id,
    'prefix': message.address.user
  }

    command_request.post({
      headers: postHeaders,
  		url: postURL,
      body: postBody
  	}, function postComplete(error, response, body) {
  		if (error || response.statusCode !== 200) {
        bot.say('Unable to complete linking. Make sure you copied the right OTP and it is not expired.');
    		return;
      }
  		try {
        // user profile
  			var haystackUserData = JSON.parse(body);
        bot.say('Welcome' + haystackUserData.firstName + '!');
  			bot.say('Link has been established successfully. You will now receive notifications on this channel.');

        // time to update redis records
        injectUserData(message, haystackUserData);
  		} catch(e) {
  			bot.say('Unable to complete linking. Make sure you copied the right OTP and it is not expired.');
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
          user.linked_to_haystack = true,
          user.haystack_id = haystackUserData.userId
        }

        msbotController.storage.users.save(user, function(err, id) {});
      });
    }

};
