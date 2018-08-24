/*Common request provider for all announcer related interactions*/
const logger = reqlib('/utilities/interpreter/logger.js').fetchLogger(__dirname + __filename);
const ResponseCode = reqlib('/utilities/interpreter/rode.js').fetchResponseCode();

module.exports = function commonRequestProvider(msbotController, bot, message, storageComplex, locale) {
  let requestType = storageComplex.requestType;
  let requestBody = storageComplex.requestBody;
  let requestBody = storageComplex.requestTokenHandle;
  let requestBody = storageComplex.requestBody;

  let commonProvider = require(__dirname + '/../providers/common_provider.js');

  // any post or get always needs bearer token first and hence
  // but we still need to deduce the callback method

  // step 1 - know what resource to request
  deduceCallbackRequestorThroughAccess(storageComplex);

  function deduceCallbackRequestorThroughAccess (storageComplex) {
    switch(storageComplex.requestType) {
      case 'POST':
      // step 2 - attempt to request resource using bearer token
      getAccessBearer(storageComplex, performAuthorizedPostWithJSON);
      break;
      case 'GET':
      getAccessBearer(storageComplex, performAuthorizedGet);
      case 'POSTAF':
      // no such token requirements over here
      performAnonymousPostAsForm(storageComplex);
      default:
      logger.debug('No know route to requested resource. Terminating.');
      break;
    }
  }

  function performAuthorizedPostWithJSON (err, result){
    if(err) {
      console.log(err);
      commonProvider.respondNotLinked(bot, message);
      return;
    }

    if(!result) {
      // token is missing; possibly expired and hence removed
      // activate refresh routine
      getRefreshBearer(storageComplex, performAuthorizedPostWithJSON);
      return;
    }

  }

  // Aids in posting ananymous form data
  function performAnonymousGet (anonymousStorageComplex) {
  }

  // Aids in posting ananymous form data
  function performAnonymousPostAsForm (anonymousStorageComplex) {
    command_request.post({
  		url: anonymousStorageComplex.requestURL,
      headers: anonymousStorageComplex.requestHeaders,
      method: anonymousStorageComplex.requestMethod,
      form: anonymousStorageComplex.requestFormData
  	}, function postComplete(error, response, body) {
  		if (error || response.statusCode !== 200) {
        // this certainly failed
        commonProvider.respondNotLinked(bot, message);
      }
  		try {
        anonymousStorageComplex.cb(response, body);

  		} catch(e) {
        // this definitely failed
        logger.error('Failed to forward anonymous response', e);
  			commonProvider.respondNotLinked(bot, message);
  		}
  	});

  }

  function refreshFallibleToken(){
    let refreshToken = '';
    let anonymousStorageComplex = {};
    anonymousStorageComplex.requestURL = let postURL = process.env.haystack_application_url + '/token/refresh';
    anonymousStorageComplex.requestHeaders = {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      };
    anonymousStorageComplex.requestFormData = {
      'grant_type': primaryEmail,
      'refresh_token': refreshToken
    };
    anonymousStorageComplex.requestMethod = 'POST';
    anonymousStorageComplex.cb = braidRefreshTokenAdjustment;

    performAnonymousPostAsForm(anonymousStorageComplex);
  }

  // soley responsible for kick starting calling method with valid credentials
  function braidRefreshTokenAdjustment(response, body) {

  }

  function performAuthorizedGet (err, result){

  }

  function getAccessBearer(storageComplex, cb){
    let request_cache_module = require(__dirname + '/../../components/request_cache.js')();
    request_cache_module.get(storageComplex.requestTokenHandle + "_access", cb);
    request_cache_module.quit();
  }

  function getRefreshBearer(storageComplex, cb){
    let request_cache_module = require(__dirname + '/../../components/request_cache.js')();
    request_cache_module.get(storageComplex.requestTokenHandle + "_refresh", cb);
    request_cache_module.quit();
  }

  function postConnect(err, result) {
    if(err) {
      console.log(err);
      respondNotLinked(bot, message);
      return;
    }

    if(!result) {
      respondNotLinked(bot, message);
      return;
    }

    let postURL = process.env.haystack_orator_bot_application_url + '/checkout/' + haystackUserId + '/mynetwork';
    let postBody = JSON.stringify(possibleFriends);
    let postBearer = 'Bearer ' + result;

    let postHeaders = {
        'Accept': 'application/json',
        'Authorization': postBearer
      };

    command_request.post({
      url: postURL,
      method: 'POST',
      headers: postHeaders,
      json: possibleFriends
    }, function postComplete(error, response, body) {
      if (error || response.statusCode !== 200) {
        respondUnableToConnect(bot, message);
        return;
      }
      try {
        // user profile
        // body is already object, no need for JSON.parse(body);
        bot.reply(message, bot.i18n.__({phrase:'connect_command_now_connected', locale:message.haystack_locale}, friendsAlias));

      } catch(e) {
        respondUnableToConnect(bot, message);
      }
    });
  }

}
