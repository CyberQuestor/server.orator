/* This module kicks in if no Botkit Studio token has been provided */

module.exports = function welcome(controller) {

  // function hoist
  //controller.on('hello', conductOnboarding);
  //controller.on('welcome_back', conductOnboarding);
  controller.on('message_received', unhandledMessage);

  function conductOnboarding(bot, message) {
    bot.reply(message, {
      type: "typing"
    });

    bot.startConversation(message, function(err, convo) {
      convo.say('Hello! I am a collective of Haystack.One Sentient Bots (you can call me HOBS).');
      convo.say({
        attachments: [{
          contentType: 'image/png',
          contentUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a6/Bender_Rodriguez.png',
          name: 'Bender_Rodriguez.png'
        }]
      });
      //convo.say('If you are new here, check out what I am about.');
      convo.say({
        attachments: [{
          contentType: 'application/vnd.microsoft.card.hero',
          content: {
            title: "If you are new here.",
            subtitle: "Check out what I am about.",
            buttons: [{
                type: "imBack",
                title: "What are you?",
                value: "what are you?"
              },
              {
                type: "imBack",
                title: "I am ready to sign-up",
                value: "lets start using!"
              }
            ]
          }
        }]
      });
    });
  }

  // Handler for any command starting with a !
  function onCommand(bot, message) {
  	let msg = message.text;
    // ensure that commands do not carry any tags
    msg = msg.replace(/<(?:.|\n)*?>/gm, '');

  	let match = msg.match(/!(\w+)(.*)/);
  	let command = match[1],
  		args = match[2] || '';
  	try {
  		let module = require(__dirname + '/../../commands/' + command + '_command.js');
  		module(controller, bot, message, args.trim().split(/\s+/));
  	} catch(e) {
  		bot.reply(message, 'I wish that was a command! Try again.');
  	}
  }

  // matches all commands here
  // Detect a `!` prefixed message which acts as command trigger.
  //------/!\w+/i
  // keep this at top so that commands are looked for first
  controller.hears(/!\w+/i, ['message_received', 'direct_message'], custom_haystack_link_command_hear_middleware, function(bot, message) {
    onCommand(bot, message);
  });

  controller.hears(['hi', 'hello', 'hey'], ['message_received', 'direct_message'], custom_haystack_link_hear_middleware, function(bot, message) {
    conductOnboarding(bot, message);
  });

  controller.hears(['lets start using', 'sign up', 'try'], ['message_received', 'direct_message'], custom_haystack_link_hear_middleware, function(bot, message) {
    bot.reply(message, {
      type: "typing"
    });

    bot.startConversation(message, function(err, convo) {
      // convo.say('Time to: \n\n[Sign in](https://haystack.one/haystack/sign_in)\n\n[Join us](https://haystack.one/haystack/sign_up)');
      convo.say({
        attachments: [{
          contentType: 'application/vnd.microsoft.card.hero',
          content: {
            title: "Time to check out Haystack.",
            subtitle: "It's easy to start using.",
            buttons: [{
                type: "openUrl",
                title: "Sign in",
                value: "https://haystack.one/haystack/sign_in"
              },
              {
                type: "openUrl",
                title: "Join us",
                value: "https://haystack.one/haystack/sign_up"
              }
            ]
          }
        }]
      });

    });
  });

  controller.hears('people', ['message_received', 'direct_message'], custom_haystack_link_hear_middleware, function(bot, message) {
    bot.reply(message, {
      type: "typing"
    });

    bot.startConversation(message, function(err, convo) {
      //convo.say('You can check out people theme over [here!](https://haystack.one/haystack/home/solutions#people)');
      convo.say({
        attachments: [{
          contentType: 'application/vnd.microsoft.card.hero',
          content: {
            title: "People.",
            subtitle: "You can check out people theme over here!",
            buttons: [{
              type: "openUrl",
              title: "Haystack People",
              value: "https://haystack.one/haystack/home/solutions#people"
            }]
          }
        }]
      });
    });
  });

  controller.hears('legal', ['message_received', 'direct_message'], custom_haystack_link_hear_middleware, function(bot, message) {
    bot.reply(message, {
      type: "typing"
    });

    bot.startConversation(message, function(err, convo) {
      // convo.say('You can check out legal theme over [here!](https://haystack.one/haystack/home/solutions#legal)');
      convo.say({
        attachments: [{
          contentType: 'application/vnd.microsoft.card.hero',
          content: {
            title: "Legal.",
            subtitle: "You can check out legal theme over here!",
            buttons: [{
              type: "openUrl",
              title: "Haystack Legal",
              value: "https://haystack.one/haystack/home/solutions#legal"
            }]
          }
        }]
      });
    });
  });

  controller.hears('wealth', ['message_received', 'direct_message'], custom_haystack_link_hear_middleware, function(bot, message) {
    bot.reply(message, {
      type: "typing"
    });

    bot.startConversation(message, function(err, convo) {
      // convo.say('You can check out wealth theme over [here!](https://haystack.one/haystack/home/solutions#wealth)');
      convo.say({
        attachments: [{
          contentType: 'application/vnd.microsoft.card.hero',
          content: {
            title: "Wealth.",
            subtitle: "You can check out wealth theme over here!",
            buttons: [{
              type: "openUrl",
              title: "Haystack Wealth",
              value: "https://haystack.one/haystack/home/solutions#wealth"
            }]
          }
        }]
      });

    });
  });

  // set up a menu thread which other threads can point at.
  controller.hears(['what are you'], ['message_received', 'direct_message'], custom_haystack_link_hear_middleware, function(bot, message) {
    bot.reply(message, {
      type: "typing"
    });

    bot.startConversation(message, function(err, convo) {

      convo.say('I am a platform that helps you achieve [trusted curation using the wisdom of your networks](https://haystack.one/)');

      convo.say('I am not trying to reinvent the wheel, just rearranging technology in a form people understand.');

      convo.say({
        attachments: [{
          contentType: 'application/vnd.microsoft.card.hero',
          content: {
            title: "Do you want to know more about the themes I can provide?",
            subtitle: "You can check out all themes over here!",
            buttons: [{
                type: "imBack",
                title: "Wealth",
                value: "show me wealth"
              },
              {
                type: "imBack",
                title: "People",
                value: "show me people"
              },
              {
                type: "imBack",
                title: "Legal",
                value: "show me legal"
              }
            ]
          }
        }]
      });

    });

  });

  function unhandledMessage(bot, message) {
    bot.reply(message, {
      type: "typing"
    });

    if (message.haystack_data && message.haystack_data.linked_to_haystack) {
      bot.startConversation(message, function(err, convo) {
        convo.say('I do not know how to respond to that message yet.');
        convo.say({
          attachments: [{
            contentType: 'application/vnd.microsoft.card.hero',
            content: {
              title: "But I am constantly learning as we speak.",
              subtitle: "Check out what I am about.",
              buttons: [{
                  type: "imBack",
                  title: "What are you?",
                  value: "what are you?"
                },
                {
                  type: "imBack",
                  title: "I am ready to sign-up",
                  value: "lets start using!"
                }
              ]
            }
          }]
        });

      });
    } else {
      // let build the link-up flow
      let urlParameter = "";
      let signInURL = process.env.haystack_orator_ui_signin_url;
      let signUpURL = process.env.haystack_orator_ui_joinus_url;
      let isAllowed = false;

      try {
    		let commonProvider = require(__dirname + '/../../providers/common_provider.js');
    		isAllowed = commonProvider.verifyChannelValidity(bot, message);
        if(isAllowed) {
          urlParameter = "?bot=" + commonProvider.formulateBotLinkURL(message);
          signInURL = signInURL + urlParameter;
          signInURL = signInURL + urlParameter;
        }
    	} catch(e) {
    		signInURL = process.env.haystack_orator_ui_signin_url;
        signUpURL = process.env.haystack_orator_ui_joinus_url;
    	}

      if(isAllowed){
        bot.startConversation(message, function(err, convo) {
          //convo.say('You have to link your account to talk more with me.');
          convo.say({
            attachments: [{
              contentType: 'application/vnd.microsoft.card.hero',
              content: {
                title: "Link to Haystack.One",
                subtitle: "You have to link your account to talk more with me.",
                buttons: [{
                  type: "openUrl",
                  title: "Sign in",
                  value: signInURL
                },
                {
                  type: "openUrl",
                  title: "Join us",
                  value: signUpURL
                }]
              }
            }]
          });
        });
      }
    }

  }

  // this middleware just ensures that none of the messages are serviced unless we have a link to haystack data
  function custom_haystack_link_hear_middleware(patterns, message) {
    if (message.haystack_data && message.haystack_data.linked_to_haystack) {
      // use default regex for now
      return controller.hears_regexp(patterns, message);
    }
    return false;
  }

  // this middleware just ensures that none of the commands are serviced unless we have a link to haystack data
  // it services link command always
  function custom_haystack_link_command_hear_middleware(patterns, message) {
    let msg = message.text;
    let originalMatch = msg.match(patterns[0]);

    if(!originalMatch) {
      // no match
      return false;
    }

  	let match = msg.match(/!(\w+)(.*)/);
  	let command = match[1];
    command = command.toLowerCase();

    if (command === 'link' || (message.haystack_data && message.haystack_data.linked_to_haystack)) {
      return true;
    }
    return false;
  }

}
