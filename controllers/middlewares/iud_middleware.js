const util = require('util');

// inject user data middleware
module.exports = function injectUserDataMiddleware (msbotController, msBot) {
  // function hoist
  msbotController.middleware.receive.use(injectUserData);

  async function injectUserData(bot, message, next) {
    // check if user is already linked
    message.haystack_data = {};
    await injectPromisedUserData(message);
    // do not let this be asynchronously written; it might not be available for consumption at message in-time
    next();
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
