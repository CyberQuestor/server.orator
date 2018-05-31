
module.exports = function unlinkProvider(msbotController, bot, storagePrefix) {

  // time to remove it
  var dejectedUser = dejectUserData(storagePrefix);

  // now say a few words
  bot.say(
    {
      text: "I am sad to see you leave! Your account is now unlinked with Haystack.One",
      address: storagePrefix.address
    }
  );


  // add user record in to DB
  function dejectUserData(storagePrefix) {
    var userRecord = msbotController.storage.users.get(storagePrefix.user, function fetchUser(error, user){
      if (user) {
        // found the person, unlink haystack data
        user.linked_to_haystack = false;
        user.haystack_id = '';
        msbotController.storage.users.save(user, function(err, id) {});
      }
    });
  }
}
