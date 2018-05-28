var Promise = require('promise');

module.exports = function(msbotController, msBot) {
  var promiseStorage = require('botkit-promise-storage')(msbotController);

  msbotController.middleware.receive.use(function(bot, message, next) {
    console.log("msbotController.middleware.receive.use triggered");
    // check if user is already linked
    message.haystack_data = {};




    injectUserData(message);

    console.log("injected user in to message now");
    message.haystack_data_promise = {
        id: message.user,
        linked_to_haystack: false
    };

    // this is asynchronously written and might not be available for consumption at message in-time
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

    new Promise((resolve, reject) => {
        msbotController.storage.users.get(message.user, function(err, user) {
            if (err) reject(err);
            //if (!user) reject(new Error('no user for id: ' + useId)); // this branch needs to be catered for
            if (!user) {
                user = {
                    id: message.user,
                    linked_to_haystack: false
                };
                msbotController.storage.users.save(user, function (err, id) {
                  // save success
                });
                // message.haystack_data = user;

                console.log("not available yet!!!!!!!");
                //console.log(message.haystack_data);
            }
            resolve(user); // make `user` available to the .then() below
        });
    }).then(function(user) {
      console.log("available!!!!!!!");
      console.log(user); // compact and safe
      message.haystack_data = user;
      //console.log("promised message");
      //console.log(message);
      //return user;
    });
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
