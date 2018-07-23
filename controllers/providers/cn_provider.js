/*Common text-only notifications provider*/

module.exports = function commonNotificationProvider(msbotController, bot, storageComplex, locale) {
  let bunchOfArguments = storageComplex.arguments;
  let messageKey = storageComplex.key;

  // extracting prefix
  let extractedPrefix = "";
  try {
    extractedPrefix = JSON.parse(storageComplex.prefix);
  } catch (e) {
    console.log("Unable to parse prefix");
    return;
  }

  switch(messageKey){
    case 'common_notification_provider_pov_share_body':
      contextShareNotification(bunchOfArguments, messageKey);
      break;
    default:
    break;
  }

  function contextShareNotification(bunchOfArguments, messageKey){
    let simpleText = bot.i18n.__mf({phrase: messageKey, locale}, bunchOfArguments);

    // now say a few words
    bot.say(
      {
        text: simpleText,
        address: extractedPrefix.address
      }
    );
  }
}
