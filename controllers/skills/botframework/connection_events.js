const logger = reqlib('/utilities/interpreter/logger.js').fetchLogger(__dirname + __filename);
const ResponseCode = reqlib('/utilities/interpreter/rode.js').fetchResponseCode();

module.exports = function connectionEvents(controller) {
  // function hoist
  controller.on('contactRelationUpdate', handleContactUpdate);
  //controller.on('conversationUpdate', handleConversationUpdate);

    if (!controller.storage || !controller.storage.user || !controller.storage.user.linked_to_haystack) {
      logger.silly("no conversation history link to haystack!");
    }

    function handleConversationUpdate(bot, message) {
      console.log("message is");
      console.log(message);

    }

    function handleContactUpdate(bot, message) {
      if(message.action == 'add') {
        _welcomeUser(bot, message);
      } else if (message.action == 'remove') {
        _thankUser(bot, message);
      }

    }

    function _welcomeUser(bot, message) {
      if (message.haystack_data && message.haystack_data.linked_to_haystack) {
        // step 1 - if am linked; welcome me
        bot.reply(bot.i18n.__({phrase:'contact_add_welcome_return_message', locale:message.haystack_locale}));
      } else {
        //step 2 - if am not linked already; ask me to link
        //bot.reply(bot.i18n.__({phrase:'contact_add_welcome__return_message', locale:message.haystack_locale}));
        //let commonProvider = require(__dirname + '/../../providers/common_provider.js');
        //aliasType = commonProvider.askContactToLinkHaystack(bot, message);

        let simpleText = bot.i18n.__({phrase: 'contact_add_welcome_return_message', locale:message.haystack_locale});

        // now say a few words
        bot.say(
          {
            text: "HI",
            address: message.address
          }
        );
      }
    }

    function _thankUser(bot, message) {
      if (message.haystack_data && message.haystack_data.linked_to_haystack) {
        let module = require(__dirname + '/../../commands/unlink_command.js');
        module(controller, bot, message, ["haystack"]);
      }
      // else - nothing to say; I was never a linked contact
    }

}
