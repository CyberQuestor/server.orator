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
  const storage_util = require('util');

  return {
          get: async function retrieve(id) {
            if(!id) {
              err = new Error('The given key must be valid');
              return err;
            }

            let result = await getRecord (id);

            return result;
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

  async function getRecord(id) {
    let result = null;
    let userCheck = storage_util.promisify(client.get);

    await userCheck(id).then((record) => {
      if(record != null) {
        result = record;
      }
    }).catch((error) => {
      console.log(error);
    });

    return result;
  }
}
