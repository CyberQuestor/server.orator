/*Common request promise provider for all announcer related interactions*/
const logger = reqlib('/utilities/interpreter/logger.js').fetchLogger(__dirname + __filename);
const ResponseCode = reqlib('/utilities/interpreter/rode.js').fetchResponseCode();
const requestPromise = require('request-promise');
const Promise = require("bluebird");
const util = require('util');

module.exports = {
  storageComplex: null,
  locale: null,
  accessToken: null,
  refreshToken: null,

  initializeGet: function() {
    logger.silly('hit initilizeGet');
    logger.silly('storageComplex is:' + this.storageComplex);
          //---> bearer data
          //---> refresh data or just pass through bearer data
    this.accessBearerAsync(this.storageComplex, this.updateAccessBearer)
      .then(this.decideRefreshAsync(this.storageComplex, this.updateRefreshBearer))
      .then(this.performAuthorizedGet(this.accessToken, this.refreshToken));
  },

  performAuthorizedGet: function(accessToken, refreshToken) {
    //return requestPromise(storageComplex.requestOptions);
    logger.silly('hit performAuthorizedGet');

    return new Promise(function (resolve, reject) {
        try {
          console.log("access token is: " + accessToken);
          console.log("refresh token is: " + refreshToken);
          resolve(this.accessToken);
        } catch (err) {
          reject(err);
        }
    });
  },

  /*etAccessBearer: function (err, cb){
    logger.silly('hit getAccessBearer');
    return;
    let request_cache_module = require(__dirname + '/../../components/request_cache.js')();
    request_cache_module.get(this.storageComplex.tokenHandle + "_access", cb);
    request_cache_module.quit();
  },

  getRefreshBearer: function (err, cb){
    logger.silly('hit getRefreshBearer');
    return;
    // let request_cache_module = require(__dirname + '/../../components/request_cache.js')();
    // request_cache_module.get(storageComplex.tokenHandle + "_access", cb);
    // request_cache_module.quit();
  },*/

  updateAccessBearer: function (err, result){
    if(result) {
      this.accessToken = result;
    }
  },

  updateRefreshBearer: function (err, result){
    if(result) {
      this.refreshToken = result;
    }
  },

  accessBearerAsync: function (storageComplex, updateCb){
    logger.silly('hit accessBearerAsync');
    // let waitAsync = util.promisify(this.getAccessBearer);
    // return waitAsync;
    //let waitAsyn = Promise.promisifyAll(require(__dirname + '/../../components/request_cache.js')());
    //return waitAsyn.get;
    return new Promise(function (resolve, reject) {
        try {
          let request_cache_module = require(__dirname + '/../../components/request_cache.js')();
          request_cache_module.get(storageComplex.tokenHandle + "_access", updateCb);
          request_cache_module.quit();
          resolve(updateCb);
        } catch (err) {
          //reject(err);
        }
    });
  },

  decideRefreshAsync: function (storageComplex, updateCb){
    logger.silly('hit decideRefreshAsync');
    // let waitAsync = util.promisify(this.decideRefreshAsync);
    // return waitAsync;

    return new Promise(function (resolve, reject) {
        try {
          let request_cache_module = require(__dirname + '/../../components/request_cache.js')();
          resolve(request_cache_module.get(storageComplex.tokenHandle + "_refresh", updateCb));
          request_cache_module.quit();
        } catch (err) {
          //reject(err);
        }
    });
  }

}
