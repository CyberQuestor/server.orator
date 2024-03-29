/*Common text-only notifications provider*/
const logger = reqlib('/utilities/interpreter/logger.js').fetchLogger(__dirname + __filename);
const ResponseCode = reqlib('/utilities/interpreter/rode.js').fetchResponseCode();

module.exports = function commonNotificationProvider(msbotController, bot, storageComplex, locale) {
  let bunchOfArguments = storageComplex.arguments;
  let messageKey = storageComplex.key;

  // extracting prefix
  let extractedPrefix = "";
  try {
    extractedPrefix = JSON.parse(storageComplex.prefix);
  } catch (e) {
    logger.error(ResponseCode.ParsingPrefixException, e);
    return;
  }

  switch(messageKey){
    case 'common_notification_provider_pov_share_body':
      contextShareNotification(bunchOfArguments, messageKey);
      break;
    case 'common_notification_provider_pov_prompt_body':
    case 'common_notification_provider_pov_recommend_body':
    case 'common_notification_provider_pov_show_disinterest_body':
    case 'common_notification_provider_pov_show_interest_body':
    case 'common_notification_provider_pov_questionnaire_followup_body':
    case 'common_notification_provider_license_approved_body':
    case 'common_notification_provider_license_rejected_body':
    case 'common_notification_provider_corporate_welcome_body':
    case 'common_notification_provider_initial_goodies_body':
    case 'common_notification_provider_earned_goodies_body':
    case 'common_notification_provider_missed_goodies_body':
    case 'common_notification_provider_benefactor_connect_body':
    case 'common_notification_provider_remove_all_group_body':
    case 'common_notification_provider_import_failure_partial_body':
    case 'common_notification_provider_import_failure_all_body':
    case 'common_notification_provider_import_success_body':
    case 'common_notification_provider_whatsnew_broadcast_body':
    case 'common_notification_provider_user_connect_body':
      contextCommonNotification(bunchOfArguments, messageKey);
      break;
    default:
      break;
  }

  function contextCommonNotification(bunchOfArguments, messageKey){
    let simpleText = bot.i18n.__mf({phrase: messageKey, locale}, bunchOfArguments);

    // now say a few words
    bot.say(
      {
        text: simpleText,
        address: extractedPrefix.address
      }
    );
  }

  function contextShareNotification(bunchOfArguments, messageKey){
    let simpleText = bot.i18n.__mf({phrase: messageKey, locale}, bunchOfArguments);

    // now say a few words
    bot.say(
      {
        text: simpleText,
        address: extractedPrefix.address
      }
    );
  }

}
