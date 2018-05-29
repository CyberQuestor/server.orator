const util = require('util');

// inject user data middleware
module.exports = function injectUserDataMiddleware (msbotController, msBot) {
  // function hoist
  msbotController.middleware.receive.use(injectUserData);

  const getAsync = util.promisify(msbotController.storage.users.get);

  async function injectUserData(bot, message, next) {
    console.log("msbotController.middleware.receive.use triggered");
    // check if user is already linked
    message.haystack_data = {};
    //await injectPromisedAsyncUserData(message);

    await injectPlainUserData(message);
    console.log("injected user in to message now");
    // do not let this be asynchronously written; it might not be available for consumption at message in-time
    next();
  }

  /**
   * Resolve user presence through promise async
   */
  async function injectPromisedAsyncUserData(message) {
    const matchedUser = await getAsync(message.user);
    console.log("async in progress");
    if (!matchedUser) {
      console.log("user is non existent apparently!");
      matchedUser = {
        id: message.user,
        linked_to_haystack: false
      };
      msbotController.storage.users.save(matchedUser, function(err, id) {});
    } else {
      console.log("user exists!");
    }
    message.haystack_data = matchedUser;
    console.log("injection status is: ");
    console.log(message.haystack_data);
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
   * Resolve user presence without promise but await
   */
  async function injectPlainAwaitUserData(message) {
    msbotController.storage.users.get(message.user, function(err, user) {
      console.log("callback user : ");
      console.log(user);
      if (!user) {
        console.log("user is non existent apparently!");
        user = {
          id: message.user,
          linked_to_haystack: true
        };
        //msbotController.storage.users.save(user, function(err, id) {});
      } else {
        console.log("user exists!");
      }
      message.haystack_data = user;
      console.log(message.haystack_data);
    });
  }

  /**
   * Resolve user presence without promise
   */
  async function injectPlainUserData(message) {
    var user = await msbotController.storage.users.get(message.user, function(err, user) {
      console.log("callback user : ");
      console.log(user);
    });
    console.log("injectUserData");
    console.log(user);
    if (!user) {
      console.log("user is non existent apparently!");
      user = {
        id: message.user,
        linked_to_haystack: false
      };
      //msbotController.storage.users.save(user, function(err, id) {});
    } else {
      console.log("user exists!");
    }
    message.haystack_data = user;
    console.log(message.haystack_data);
  }

}
