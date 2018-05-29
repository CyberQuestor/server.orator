const util = require('util');
const {promisify} = require('util');

module.exports = function(msbotController, msBot) {
  const getAsync = promisify(msbotController.storage.users.get);

  msbotController.middleware.receive.use(function(bot, message, next) {
    console.log("msbotController.middleware.receive.use triggered");
    // check if user is already linked
    message.haystack_data = {};
    injectPromisedAsyncUserData(message);
    console.log("injected user in to message now");
    // do not let this be asynchronously written; it might not be available for consumption at message in-time
    next();
    });

    /**
    * Resolve user presence through promise async
    */
    async function injectPromisedAsyncUserData(message) {
      const res = await getAsync(message.user);
      console.log("async in progress");
      console.log(res);
    }

    /**
    * Resolve user presence through promise
    */
    function injectPromisedUserData(message) {
      const userCheck = util.promisify(msbotController.storage.users.get);
      userCheck(message.user).then((user) => {
        // Do something with `user`
        console.log("injectPromisedUserData");
        //console.log(user);
        if (!user) {
          console.log("user is non existent apparently!");
            user = {
                id: message.user,
                linked_to_haystack: false
            };
            msbotController.storage.users.save(user, function(err, id) {});
        } else {
          console.log("user exists!");
        }
        message.haystack_data = user;
        console.log("injection status is: ");
        console.log(message.haystack_data);
      }).catch((error) => {
        // Handle the error.
        console.log(error);
      });
    }

  /**
  * Resolve user presence without promise
  */
  function injectUserData(message) {
    var user = msbotController.storage.users.get(message.user, function(err, user) {console.log("callback user : "); console.log(user);});
    console.log("injectUserData");
    console.log(user);
    if (!user) {
      console.log("user is non existent apparently!");
        user = {
            id: message.user,
            linked_to_haystack: false
        };
        msbotController.storage.users.save(user, function(err, id) {});
    } else {
      console.log("user exists!");
    }
    message.haystack_data = user;
    console.log(message.haystack_data);
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
