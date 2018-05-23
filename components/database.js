// users, teams, channels, contexts, outcomes available
// history is not available, use separate middleware to handle that

module.exports = function(config) {
  redisConfig = {
    host: process.env.haystack_orator_redis_host,
    port: process.env.haystack_orator_redis_port,
    db: process.env.haystack_orator_redis_db,
    namespace: 'haystack:bot:store',
    methods: ['contexts', 'outcomes']
  };

  return redisStorage = redisStorage = require('botkit-storage-redis')(redisConfig);
}
