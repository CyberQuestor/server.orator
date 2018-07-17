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
  }
}
