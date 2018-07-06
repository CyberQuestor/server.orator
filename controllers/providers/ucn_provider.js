/*User connection notification provider*/
module.exports = function userConnectNotificationProvider(msbotController, bot, storageComplex) {
  let myName = storageComplex.myProfile.firstName;
  let friendsName = storageComplex.friendProfile.firstName;
  let friendsAlias = storageComplex.friendsAlias

  let dialogTitle = friendsName + ' has connected with you';
  let dialogSubtitle = 'Would you like to connect?';
  let postBackText = '!connect with ' + friendsAlias;

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
            title: "Connect",
            value: postBackText
          }]
        }
      }],
      address: extractedPrefix.address
    }
  );
}
