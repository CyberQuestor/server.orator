// users, teams, channels, contexts, outcomes available
// history is not available, use separate middleware to handle that

const request_redis = require('redis');

module.exports = function request_cache(config) {
  config = config || {};
  config.namespace = config.namespace || '';

  let redisConfig = {
    host: process.env.haystack_orator_redis_host,
    port: process.env.haystack_orator_redis_port,
    db: process.env.haystack_orator_redis_db,
  };

  if(config.namespace !== '') {
    redisConfig.namespace = config.namespace;
  }

  if(process.env.redsec) {
    redisConfig.password = process.env.redsec;
  }

  let storage = {};
  let client = request_redis.createClient(redisConfig); // could pass specific redis config here

  storage = getStorageObject(client);

  return storage;
};


/**
 * Function to generate a storage object for a given namespace
 *
 * @param {Object} client The redis client
 * @returns {{get: get, save: save, remove: remove}}
 */
function getStorageObject(client) {
  const {promisify} = require('util');
  const getAsync = promisify(client.get).bind(client);

  return {
          get: function retrieve(id, cb) {
            if(!id) {
              return cb(new Error('The given key must be valid'), null);
            }

            return getAsync(id).then(function(res) {
                cb(null, res); // => 'bar'
            }).catch((error) => {
              console.log(error);
              return cb(new Error('Unable to find record'), null);
            });
          },
          save: function persist(key, value, cb) {
              if (!key) {
                  return cb(new Error('The given key must be valid'), {});
              }

              client.set(key, value, cb);
          },
          remove: function eliminate(id, cb) {
              client.del([id], cb);
          },

          quit: function cutAndRun() {
              client.quit();
          }
        };
}
