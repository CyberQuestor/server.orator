/*Common request fact provider for all announcer related interactions*/
const logger = reqlib('/utilities/interpreter/logger.js').fetchLogger(__dirname + __filename);
const ResponseCode = reqlib('/utilities/interpreter/rode.js').fetchResponseCode();
const common_request = require('request');
const commonProvider = require(__dirname + '/../providers/common_provider.js');

module.exports = {
  storageComplex: null,

  initializeGet: function() {
    // step 1
    this.getAccessBearer(this.storageComplex, this.routeThroughBearerOrAction);
  },

  performAuthorizedGet: function(accessToken, refreshToken) {

  },

  routeThroughBearerOrAction: function(err, result) {
    let lookForRefresh = false;
    // check if token exists
    if(err) {
      // step 11
      logger.silly("Perhaps DB is down. Looking for refresh token.", err)
      lookForRefresh = true;
    }

    if(!result) {
      // step 11
      logger.silly("Perhaps token expired. Looking for refresh token.", err)
      lookForRefresh = true;
    }

    if(lookForRefresh) {
      // step 10
      // look for refresh token
      this.getRefreshBearer(this.storageComplex, this.routeThroughRefreshOrAction);
      return;
    }

    // all good and got the token, time to send out the request
    // step 4
    this.performRequest(this.storageComplex.requestOptions, result, this.storageComplex.requestCb);

  },

  routeThroughRefreshOrAction: function(err, result) {
    // check if token exists
    if(err) {
      // step 12
      logger.silly("Perhaps DB is down. Link again to be safe.", err)
      this.commonAbnormalityNotifier("Unable to perform action. Try linking the account again.", null, null);
      return;
    }

    if(!result) {
      // step 12
      logger.silly("Cannot find any token. Link again to be safe.", result)
      this.commonAbnormalityNotifier("Unable to perform action. Try linking the account again.", null, null);
      return;
    }

    // found refresh token, request for new batch
    let postFormData = {
      'grant_type': 'refresh_token',
      'refresh_token': result
    };

    let postHeaders = {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      };

    let anonymousRequestOptions = {};
    anonymousRequestOptions.uri = process.env.haystack_application_url + '/token/refresh';
    anonymousRequestOptions.form = postFormData;
    anonymousRequestOptions.headers = postHeaders;
    anonymousRequestOptions.method = 'POST';

    // step 13
    common_request(anonymousRequestOptions, this.routeThroughFinalTokenOrAction)
  },

  routeThroughFinalTokenOrAction: function(error, response, body) {
    if (error || response.statusCode !== 200) {
      //this.storageComplex.requestCb(error, response, body);
      this.commonAbnormalityNotifier(error, response, body);
      return;
    }
    try {
      let parsedBody = JSON.parse(body);
      if(parsedBody && parsedBody.access_token) {
        // now send this back to original request
        // step 14
        this.routeThroughBearerOrAction(null, parsedBody.access_token);
      } else {
        this.commonAbnormalityNotifier("Cannot find any token. Link again to be safe.", response, body);
      }
    } catch(e) {
      this.commonAbnormalityNotifier("Cannot find any token. Link again to be safe.", response, body);
    }

  },

  // Aids in performing request
  performRequest: function (storageComplex, accessToken, cb) {
    storageComplex.requestOptions.headers.Authorization = 'Bearer ' + accessToken;
    common_request(storageComplex.requestOptions, function completeRequest(error, response, body) {
  		if (error || response.statusCode !== 200) {
        if(response.statusCode === 401) {
          // step 6, 7, 8, 9
          try {
            let toughDay = JSON.parse(body);
            if(toughDay && toughDay.codeProject && toughDay.codeProject === '503') {
              // step 10
              // look for refresh token
              this.getRefreshBearer(this.storageComplex, this.routeThroughRefreshOrAction);
              return;
            }
          } catch(e) {
            // nothing much
          }
        }
        // this certainly failed
        this.commonAbnormalityNotifier("Cannot reach Haystack.One. Link again to be safe.", response, body);
        return;
      }
  		try {

        // step 5
        storageComplex.requestCb(error, response, body);

  		} catch(e) {
        // this definitely failed
        logger.error('Failed to forward anonymous response', e);
  			commonProvider.respondNotLinked(bot, message);
  		}
  	});
  },

  commonAbnormalityNotifier: function (error, response, body) {
    // step 15
    logger.silly(error);
    commonProvider.respondNotLinked(this.storageComplex.bot, this.storageComplex.message);
  },

  getAccessBearer: function (storageComplex, cb){
    // step 2
    logger.silly('hit getAccessBearer');
    let request_cache_module = require(__dirname + '/../../components/request_cache.js')();
    request_cache_module.get(storageComplex.tokenHandle + "_access", cb);
    request_cache_module.quit();
  },

  getRefreshBearer: function (storageComplex, cb){
    // step 11
    logger.silly('hit getRefreshBearer');
    let request_cache_module = require(__dirname + '/../../components/request_cache.js')();
    request_cache_module.get(storageComplex.tokenHandle + "_refresh", cb);
    request_cache_module.quit();
  }

}
