const logger = reqlib('/utilities/interpreter/logger.js').fetchLogger(__dirname + __filename);

// enable only after revisions
const cluster = require('cluster');
if (cluster.isMaster) {
  cluster.fork();

  cluster.on('exit', function(worker, code, signal) {
    logger.error('Worker ' + worker.id + ' died..', signal);
    cluster.fork();
  });
}

if (cluster.isWorker) {
  // put your code here - basically start bot.js again
  const exec = require('child_process');
  let pathToRoot = __dirname + 'bot.js';
  exec.spawn('sh', ['-c', 'sleep 2; ' + pathToRoot], {
        detached: true,
        stdio: ['ignore', 'ignore', 'ignore']
    });

process.exit(0);
}
