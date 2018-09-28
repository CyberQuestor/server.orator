/* This module kicks in if no Botkit Studio token has been provided */

const logger = reqlib('/utilities/interpreter/logger.js').fetchLogger(__dirname + __filename);
const ResponseCode = reqlib('/utilities/interpreter/rode.js').fetchResponseCode();

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
      convo.setVar("haystack_locale",message.haystack_locale);

      convo.say(bot.i18n.__({phrase:'welcome_message_hello', locale:convo.vars.haystack_locale}));
      /*convo.say({
        attachments: [{
          contentType: 'image/png',
          contentUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a6/Bender_Rodriguez.png',
          name: 'Bender_Rodriguez.png'
        }]
      });*/
      //convo.say('If you are new here, check out what I am about.');
      convo.say({
        attachments: [{
          contentType: 'application/vnd.microsoft.card.hero',
          content: {
            title: bot.i18n.__({phrase:'welcome_message_new_here', locale:convo.vars.haystack_locale}),
            subtitle: bot.i18n.__({phrase:'welcome_message_check_out', locale:convo.vars.haystack_locale}),
            buttons: [{
                type: "imBack",
                title: bot.i18n.__({phrase:'welcome_button_title_what_haystack', locale:convo.vars.haystack_locale}),
                value: bot.i18n.__({phrase:'welcome_button_payload_what_haystack', locale:convo.vars.haystack_locale})
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
      // don't send value; send code only!
      logger.silly(ResponseCode.UnrecognizedException, e);
  		bot.reply(message, bot.i18n.__({phrase:'bot_command_failsafe_wish', locale: message.haystack_locale}));
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
      convo.setVar("haystack_locale",message.haystack_locale);

      convo.say({
        attachments: [{
          contentType: 'application/vnd.microsoft.card.hero',
          content: {
            title: bot.i18n.__({phrase:'welcome_message_time_to_check', locale:convo.vars.haystack_locale}),
            subtitle: bot.i18n.__({phrase:'welcome_message_easy_to_start', locale:convo.vars.haystack_locale}),
            buttons: [{
                type: "openUrl",
                title: bot.i18n.__({phrase:'welcome_message_sign_in', locale:convo.vars.haystack_locale}),
                value: process.env.haystack_orator_ui_home + process.env.haystack_orator_ui_signin_url
              },
              {
                type: "openUrl",
                title: bot.i18n.__({phrase:'welcome_message_join_us', locale:convo.vars.haystack_locale}),
                value: process.env.haystack_orator_ui_home + process.env.haystack_orator_ui_joinus_url
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
      convo.setVar("haystack_locale",message.haystack_locale);
      convo.say({
        attachments: [{
          contentType: 'application/vnd.microsoft.card.hero',
          content: {
            title: bot.i18n.__({phrase:'welcome_message_people', locale:convo.vars.haystack_locale}),
            subtitle: bot.i18n.__({phrase:'welcome_message_people_check', locale:convo.vars.haystack_locale}),
            buttons: [{
              type: "openUrl",
              title: bot.i18n.__({phrase:'welcome_button_people_haystack', locale:convo.vars.haystack_locale}),
              value: process.env.haystack_orator_ui_home + process.env.haystack_orator_ui_people_url
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
      convo.setVar("haystack_locale",message.haystack_locale);

      convo.say({
        attachments: [{
          contentType: 'application/vnd.microsoft.card.hero',
          content: {
            title: bot.i18n.__({phrase:'welcome_message_legal', locale:convo.vars.haystack_locale}),
            subtitle: bot.i18n.__({phrase:'welcome_message_legal_check', locale:convo.vars.haystack_locale}),
            buttons: [{
              type: "openUrl",
              title: bot.i18n.__({phrase:'welcome_button_legal_haystack', locale:convo.vars.haystack_locale}),
              value: process.env.haystack_orator_ui_home + process.env.haystack_orator_ui_legal_url
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
      convo.setVar("haystack_locale",message.haystack_locale);

      convo.say({
        attachments: [{
          contentType: 'application/vnd.microsoft.card.hero',
          content: {
            title: bot.i18n.__({phrase:'welcome_message_wealth', locale:convo.vars.haystack_locale}),
            subtitle: bot.i18n.__({phrase:'welcome_message_wealth_check', locale:convo.vars.haystack_locale}),
            buttons: [{
              type: "openUrl",
              title: bot.i18n.__({phrase:'welcome_button_wealth_haystack', locale:convo.vars.haystack_locale}),
              value: process.env.haystack_orator_ui_home + process.env.haystack_orator_ui_wealth_url
            }]
          }
        }]
      });

    });
  });

  controller.hears('platform', ['message_received', 'direct_message'], custom_haystack_link_hear_middleware, function(bot, message) {
    bot.reply(message, {
      type: "typing"
    });

    bot.startConversation(message, function(err, convo) {
      // convo.say('You can check out wealth theme over [here!](https://haystack.one/haystack/home/solutions#wealth)');
      convo.setVar("haystack_locale",message.haystack_locale);

      convo.say({
        attachments: [{
          contentType: 'application/vnd.microsoft.card.hero',
          content: {
            title: bot.i18n.__({phrase:'welcome_message_platform_know_title', locale:convo.vars.haystack_locale}),
            subtitle: bot.i18n.__({phrase:'welcome_message_platform_know', locale:convo.vars.haystack_locale}),
            buttons: [{
              type: "openUrl",
              title: bot.i18n.__({phrase:'welcome_button_platform_haystack', locale:convo.vars.haystack_locale}),
              value: process.env.haystack_orator_ui_home + process.env.haystack_orator_ui_revamp_platform_url
            }]
          }
        }]
      });

    });
  });

  controller.hears(['industries', 'focus'], ['message_received', 'direct_message'], custom_haystack_link_hear_middleware, function(bot, message) {
    bot.reply(message, {
      type: "typing"
    });

    bot.startConversation(message, function(err, convo) {
      // convo.say('You can check out wealth theme over [here!](https://haystack.one/haystack/home/solutions#wealth)');
      convo.setVar("haystack_locale",message.haystack_locale);

      convo.say({
        attachments: [{
          contentType: 'application/vnd.microsoft.card.hero',
          content: {
            title: bot.i18n.__({phrase:'welcome_message_focus_industries', locale:convo.vars.haystack_locale}),
            subtitle: bot.i18n.__({phrase:'welcome_message_focus_industries_know', locale:convo.vars.haystack_locale}),
            buttons: [{
              type: "openUrl",
              title: bot.i18n.__({phrase:'welcome_button_focus_industries_haystack', locale:convo.vars.haystack_locale}),
              value: process.env.haystack_orator_ui_home + process.env.haystack_orator_ui_revamp_focus_industries_url
            }]
          }
        }]
      });

    });
  });

  // set up a menu thread which other threads can point at.
  controller.hears(['what are you', 'haystack', 'what is haystack'], ['message_received', 'direct_message'], custom_haystack_link_hear_middleware, function(bot, message) {
    bot.reply(message, {
      type: "typing"
    });

    bot.startConversation(message, function(err, convo) {
      convo.setVar("haystack_locale",message.haystack_locale);

      convo.say(bot.i18n.__({phrase:'welcome_message_platform_revamp', locale:convo.vars.haystack_locale}, process.env.haystack_orator_ui_home));

      convo.say(bot.i18n.__({phrase:'welcome_message_relevant_actionable', locale:convo.vars.haystack_locale}));

      convo.say({
        attachments: [{
          contentType: 'application/vnd.microsoft.card.hero',
          content: {
            title: bot.i18n.__({phrase:'welcome_message_know_more', locale:convo.vars.haystack_locale}),
            subtitle: bot.i18n.__({phrase:'welcome_message_all_more', locale:convo.vars.haystack_locale}),
            buttons: [{
                type: "imBack",
                title: bot.i18n.__({phrase:'welcome_button_title_platform', locale:convo.vars.haystack_locale}),
                value: bot.i18n.__({phrase:'welcome_button_payload_platform', locale:convo.vars.haystack_locale})
              },
              {
                type: "imBack",
                title: bot.i18n.__({phrase:'welcome_button_title_focus_industries', locale:convo.vars.haystack_locale}),
                value: bot.i18n.__({phrase:'welcome_button_payload_focus_industries', locale:convo.vars.haystack_locale})
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
        convo.setVar("haystack_locale",message.haystack_locale);

        convo.say(bot.i18n.__({phrase:'common_message_failsafe', locale:convo.vars.haystack_locale}));
        convo.say({
          attachments: [{
            contentType: 'application/vnd.microsoft.card.hero',
            content: {
              title: bot.i18n.__({phrase:'common_message_failsafe_learning', locale:convo.vars.haystack_locale}),
              subtitle: bot.i18n.__({phrase:'common_message_failsafe_check_out', locale:convo.vars.haystack_locale}),
              buttons: [{
                  type: "imBack",
                  title: bot.i18n.__({phrase:'common_button_title_failsafe_what', locale:convo.vars.haystack_locale}),
                  value: bot.i18n.__({phrase:'common_button_payload_failsafe_what', locale:convo.vars.haystack_locale})
                },
                {
                    type: "imBack",
                    title: bot.i18n.__({phrase:'common_button_title_failsafe_help', locale:convo.vars.haystack_locale}),
                    value: bot.i18n.__({phrase:'common_button_payload_failsafe_help', locale:convo.vars.haystack_locale})
                  }
              ]
            }
          }]
        });
        convo.say(bot.i18n.__({phrase:'common_message_failsafe_help', locale:convo.vars.haystack_locale}));

      });
    } else {
      let commonProvider = require(__dirname + '/../../providers/common_provider.js');
      aliasType = commonProvider.askContactToLinkHaystack(bot, message);
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
