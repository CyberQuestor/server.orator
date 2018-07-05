const btoa = require('btoa');
const unescape = require('unescape');

/*
* Aids in providing a host of common utility methods
*/
module.exports = {

  // aid in constructing a an encoded, escaped json based url string
  formulateBotLinkURL: function (message){
    let storagePrefix = {};
    storagePrefix.address = message.address;
    storagePrefix.user=message.user;

    let postURLData = {
      'alias': message.user,
      'prefix': storagePrefix
    };

    let stringifiedURLData = JSON.stringify(postURLData);
    return btoa(unescape(encodeURIComponent(stringifiedURLData)));
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
      return false;
    }
    return true;
  },

  // responds with usage text
  respondUnsupportedChannel: function () {
    bot.reply(message, {
      type: "typing"
    });

    bot.reply(message, 'This channel is not yet supported.');
  }
}
