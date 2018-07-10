/*
* Aids in linking haystack user with bot account
*/
module.exports = function linkProvider(msbotController, bot, storageComplex, locale) {

  let myName = storageComplex.user.firstName;

  // extracting prefix
  let extractedPrefix = JSON.parse(storageComplex.alias.prefix);

  // time to remove it
  var injectedUser = injectUserData(storageComplex, extractedPrefix);

  // now say a few words
  bot.say(
    {
      text: bot.i18n.__({phrase:'link_provider_welcome_user', locale}, myName),
      address: extractedPrefix.address
    }
  );

  bot.say(
    {
      text: bot.i18n.__({phrase:'link_provider_established', locale}),
      address: extractedPrefix.address
    }
  );

  // add user record in to DB
  function injectUserData(storageComplex, extractedPrefix) {
    var userRecord = msbotController.storage.users.get(extractedPrefix.user, function fetchUser(error, user){
      if (!user) {
        user = {
          id: extractedPrefix.user,
          haystack_id: storageComplex.user.userId,
          linked_to_haystack: true
        };
      } else {
        user.linked_to_haystack = true;
        user.haystack_id = storageComplex.user.userId;
        // why store something that's not used/ accessed when needed
        //user.haystack_user_data = storageComplex.user;
      }

      msbotController.storage.users.save(user, function(err, id) {});
    });
  }

}
