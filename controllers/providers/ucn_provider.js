/*User connection notification provider*/
module.exports = function userConnectNotificationProvider(msbotController, bot, storageComplex, locale) {
  let myName = storageComplex.myProfile.firstName;
  let friendsName = storageComplex.friendProfile.firstName;
  let friendsAlias = storageComplex.friendsAlias

  let dialogTitle = bot.i18n.__({phrase:'ucn_provider_connected_prompt', locale}, friendsName);
  let dialogSubtitle = bot.i18n.__({phrase:'ucn_provider_would_you_connect', locale});
  let postBackText = bot.i18n.__({phrase:'ucn_provider_button_payload_connect', locale}, friendsAlias);

  // extracting prefix
  let extractedPrefix = "";
  try {
    extractedPrefix = JSON.parse(storageComplex.prefix);
  } catch (e) {
    console.log("Unable to parse prefix");
    return;
  }

  // now say a few words
  bot.say(
    {
      attachments: [{
        contentType: 'application/vnd.microsoft.card.hero',
        content: {
          title: dialogTitle,
          subtitle: dialogSubtitle,
          buttons: [{
            type: "imBack",
            title: bot.i18n.__({phrase:'ucn_provider_button_title_connect', locale}),
            value: postBackText
          }]
        }
      }],
      address: extractedPrefix.address
    }
  );
}
