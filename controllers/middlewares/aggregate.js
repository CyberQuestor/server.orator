
module.exports = function(msbotController, msBot) {
  msbotController.middleware.receive.use(function(bot, message, next) {

    // do something...
    // preprocess the message content using external natural language processing services like Wit.ai.
    // message.extrainfo = 'foo';
    next();
});

msbotController.middleware.send.use(function(bot, message, next) {

    // do something useful...
    // preprocess the message content before it gets sent out to the messaging client.

    // if (message.intent == 'hi') {
    //     message.text = 'Hello!!!';
    // }
    next();

});

}
