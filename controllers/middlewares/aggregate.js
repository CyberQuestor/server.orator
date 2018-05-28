
module.exports = function(msbotController, msBot) {

  msbotController.middleware.receive.use(function(bot, message, next) {
    console.log("msbotController.middleware.receive.use triggered");
    // check if user is already linked
    message.haystack_data = {};
    injectUserData(message);
    // do not let this be asynchronously written; it might not be available for consumption at message in-time
    next();
    });

/**
* Resolve user presence through promise
*/
function injectUserData(message) {
  var user = msbotController.storage.users.get(message.user);
  if (!user) {
      user = {
          id: message.user,
          linked_to_haystack: false
      };
      msbotController.storage.users.save(user);
  } else {
    message.haystack_data = user;
  }
}

msbotController.middleware.send.use(function(bot, message, next) {

    // do something useful...
    // preprocess the message content before it gets sent out to the messaging client.

    // if (message.intent == 'hi') {
    //     message.text = 'Hello!!!';
    // }
    next();

});

}
