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
    await injectPromisedUserData(message);
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
  async function injectPromisedUserData(message) {
    const userCheck = util.promisify(msbotController.storage.users.get);
    await userCheck(message.user).then((user) => {
      if (!user) {
        user = {
          id: message.user,
          linked_to_haystack: false
        };
        msbotController.storage.users.save(user, function(err, id) {});
      }
      message.haystack_data = user;
    }).catch((error) => {
      // Handle the error.
      console.log(error);
    });
  }
  
}
