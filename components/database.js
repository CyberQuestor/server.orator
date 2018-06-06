// users, teams, channels, contexts, outcomes available
// history is not available, use separate middleware to handle that

module.exports = function(config) {
  config = config || {};
  config.namespace = config.namespace || 'haystack:bot:store';
  config.methods = config.methods || ['contexts', 'outcomes'];

  let redisConfig = {
    host: process.env.haystack_orator_redis_host,
    port: process.env.haystack_orator_redis_port,
    db: process.env.haystack_orator_redis_db,
    namespace: config.namespace,
    methods: config.methods
  };

  if(process.env.redsec) {
    redisConfig.password = process.env.redsec;
  }

  return redisStorage = require('botkit-storage-redis')(redisConfig);
}
