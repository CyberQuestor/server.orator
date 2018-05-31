/*User connection notification provider*/
module.exports = function userConnectNotificationProvider(msbotController, bot, storageComplex) {
  let myName = storageComplex.myProfile.firstName;
  let friendsName = storageComplex.friendProfile.firstName;
  let friendsAlias = storageComplex.friendsAlias

  let dialogTitle = friendsName + ' has connected with you';
  let dialogSubtitle = 'Would you like to connect?';
  let postBackText = '!connect with ' + friendsAlias;

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
      address: storageComplex.address
    }
  );
}
