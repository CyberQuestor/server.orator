const middleware_util = require('util');

/**
* This supports language alternatives at the moment.
* For a more comprehensive idiomatic based alternatives, keep an eye on lex-gib for conversation responses
* We also have to move toward botkit-middleware-witai for capturing intents
*/

// inject language idiomatic preference
module.exports = function injectUserDataMiddleware (msbotController, msBot) {
  // function hoist
  msbotController.middleware.receive.use(injectLanguagePreference);

  function injectLanguagePreference(bot, message, next) {
    // extract and inject locale preference over here later
    // checkout message.entities[0].locale
    message.haystack_locale = "en";
    next();
  }

}
