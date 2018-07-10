
module.exports = function unlinkProvider(msbotController, bot, storagePrefix, locale) {

  // time to remove it

  // step 1: from botframework user data
  dejectUserData(storagePrefix);

  // add purged user record in to DB
  function dejectUserData(storagePrefix) {
    var userRecord = msbotController.storage.users.get(storagePrefix.user, function fetchUser(error, user){
      if(error) {
        sayAFewNotSoPartingWords(storagePrefix);
        return;
      }

      if (user) {
        // found the person, unlink haystack data
        user.linked_to_haystack = false;
        user.haystack_id = '';
        //user.haystack_user_data = {};
        msbotController.storage.users.save(user, function(err, id) {});
        // step 2: remove token
        releaseToken(storagePrefix);
      } else {
        // unable to unlink
        // it might have already been unlinked (through bot); this was just precautionary
        // this path is still applicable for web ui unlinking
      }
    });
  }

  function releaseToken(storagePrefix) {
    let request_cache_module = require(__dirname + '/../../components/request_cache.js')();
    request_cache_module.remove(storagePrefix.user + "_refresh", null);
    request_cache_module.remove(storagePrefix.user + "_access", function(err, result) {
     if (result == 1 || err) {
       // that sure succeeded
       // not really worried about this one; it will expire anyway
       // or be overwritten by a new token as required
     }
   });

   // step 3: say a few parting words
   sayAFewPartingWords(storagePrefix);
   request_cache_module.quit();
  }

  function sayAFewPartingWords(storagePrefix) {
    if(storagePrefix.is_acknowledge) {
      bot.say(
        {
          text: bot.i18n.__({phrase:'unlink_provider_parting_acknowledge', locale}),
          address: storagePrefix.address
        }
      );
    } else {
      // now say a few words
      bot.say(
        {
          text: bot.i18n.__({phrase:'unlink_provider_parting_sad', locale}),
          address: storagePrefix.address
        }
      );
    }
  }

  function sayAFewNotSoPartingWords(storagePrefix) {
    // now say a few words
    bot.say(
      {
        text: bot.i18n.__({phrase:'unlink_provider_parting_unable', locale}),
        address: storagePrefix.address
      }
    );
  }
}
