const btoa = require('btoa');
const unescape = require('unescape');

/*
* Aids in providing a host of common utility methods
*/
module.exports = {

  // aid in constructing a an encoded, escaped json based url string
  formulateBotLinkURL: function (message, aliasType){
    let storagePrefix = {};
    storagePrefix.address = message.address;
    storagePrefix.user=message.user;
    let clientType = 'x-client-mca-skype';

    switch(aliasType){
      case 'SkypeBotLink':
      clientType = 'x-client-mca-skype';
      break;
      case 'TelegramBotLink':
      clientType = 'x-client-mca-telegram';
      break;
      default:
      clientType = '';
      break;
    }

    let postURLData = {
      'alias': message.user,
      'prefix': storagePrefix,
      'client': clientType,
      'aliasType': aliasType
    };

    let stringifiedURLData = JSON.stringify(postURLData);
    return encodeURIComponent(btoa(stringifiedURLData));
  },

  // check if the channel is supported
  verifyChannelValidity : function (bot, message) {
    let aliasType = 'SkypeBotLink';
    if(message.address && message.address.channelId) {
      switch(message.address.channelId){
        case 'skype':
        aliasType = 'SkypeBotLink';
        break;
        case 'telegram':
        aliasType = 'TelegramBotLink';
        break;
        default:
        aliasType = '';
        break;
      }
    }

    if(!aliasType) {
      respondUnsupportedChannel(bot, message);
      return "";
    }
    return aliasType;
  },

  // responds with usage text
  respondUnsupportedChannel: function () {
    bot.reply(message, {
      type: "typing"
    });

    bot.reply(message, bot.i18n.__({phrase:'common_provider_respond_unsupported', locale:message.haystack_locale}));
  },

  askContactToLinkHaystack: function (bot, message) {
    // lets build the link-up flow
    let urlParameter = "";
    let signInURL = process.env.haystack_orator_ui_signin_url;
    let signUpURL = process.env.haystack_orator_ui_joinus_url;
    let aliasType = "";

    try {
      let commonProvider = require(__dirname + '/common_provider.js');
      aliasType = commonProvider.verifyChannelValidity(bot, message);
      if(aliasType) {
        urlParameter = "?bot=" + commonProvider.formulateBotLinkURL(message, aliasType);
        signInURL = signInURL + urlParameter;
        signUpURL = signUpURL + urlParameter;
      }
    } catch(e) {
      signInURL = process.env.haystack_orator_ui_signin_url;
      signUpURL = process.env.haystack_orator_ui_joinus_url;
    }

    if(aliasType){
      bot.startConversation(message, function(err, convo) {
        //convo.say('You have to link your account to talk more with me.');
        convo.setVar("haystack_locale",message.haystack_locale);

        convo.say({
          attachments: [{
            contentType: 'application/vnd.microsoft.card.hero',
            content: {
              title: bot.i18n.__({phrase:'common_message_prompt_link', locale:convo.vars.haystack_locale}),
              subtitle: bot.i18n.__({phrase:'common_message_prompt_link_account', locale:convo.vars.haystack_locale}),
              buttons: [{
                type: "openUrl",
                title: bot.i18n.__({phrase:'common_button_title_prompt_sign_in', locale:convo.vars.haystack_locale}),
                value: signInURL
              },
              {
                type: "openUrl",
                title: bot.i18n.__({phrase:'common_button_title_prompt_join_us', locale:convo.vars.haystack_locale}),
                value: signUpURL
              }]
            }
          }]
        });
      });
    }
  }
}
