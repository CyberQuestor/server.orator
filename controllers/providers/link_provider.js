/*
* Aids in linking haystack user with bot account
*/
module.exports = function linkProvider(msbotController, bot, storageComplex) {

  let myName = storageComplex.user.firstName;

  // time to remove it
  var injectedUser = injectUserData(storageComplex);

  // now say a few words
  bot.say(
    {
      text: 'Welcome ' + myName + ' !',
      address: storageComplex.alias.prefix.address
    }
  );

  bot.say(
    {
      text: 'Link has been established successfully. You will now receive notifications on this channel.',
      address: storageComplex.alias.prefix.address
    }
  );

  // add user record in to DB
  function injectUserData(storageComplex) {
    var userRecord = msbotController.storage.users.get(storageComplex.alias.prefix.user, function fetchUser(error, user){
      if (!user) {
        user = {
          id: storageComplex.alias.prefix.user,
          haystack_id: storageComplex.user.userId,
          haystack_user_data: storageComplex.user,
          linked_to_haystack: true
        };
      } else {
        user.linked_to_haystack = true;
        user.haystack_id = storageComplex.user.userId;
        haystack_user_data = storageComplex.user;
      }

      msbotController.storage.users.save(user, function(err, id) {});
    });
  }

}
