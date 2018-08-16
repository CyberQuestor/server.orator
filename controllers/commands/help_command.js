const command_request = require('request');
const command_util = require('util');

const logger = reqlib('/utilities/interpreter/logger.js').fetchLogger(__dirname + __filename);
const ResponseCode = reqlib('/utilities/interpreter/rode.js').fetchResponseCode();

// This function will be run whenever link command is accessed
module.exports = function helpCommand (msbotController, bot, message, arguments) {
	// Bot code here - check command structure
  let haystackWord = arguments[0];

  let haystackUserId = getHaystackUserId(message);
  if(!haystackUserId) {
    respondNotLinked(bot, message);
  }

  respondSolace(bot, message);

  // responds with usage text
  function respondSolace(bot, message) {
    bot.reply(message, {
      type: "typing"
    });

    bot.startConversation(message, function(err, convo) {
      convo.setVar("haystack_locale",message.haystack_locale);

      convo.say(bot.i18n.__({phrase:'help_message_narrate_solace', locale:convo.vars.haystack_locale}));
      convo.say({
        attachments: [{
          contentType: 'application/vnd.microsoft.card.hero',
          content: {
            title: bot.i18n.__({phrase:'help_message_narrate_solace_prompt', locale:convo.vars.haystack_locale}),
            buttons: [{
                type: "imBack",
                title: bot.i18n.__({phrase:'help_button_title_narrate_solace_prompt', locale:convo.vars.haystack_locale}),
                value: bot.i18n.__({phrase:'help_button_payload_narrate_solace_prompt', locale:convo.vars.haystack_locale})
              }
            ]
          }
        }]
      });
      convo.say(bot.i18n.__({phrase:'help_message_narrate_solace_unlink', locale:convo.vars.haystack_locale}));
    });
  }

  // get user record from DB
  function getHaystackUserId(message) {
    if(message.haystack_data) {
      return message.haystack_data.haystack_id;
    }
  }

};
