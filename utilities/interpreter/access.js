const global_exec_sync = require('child_process').execSync;
const global_util = require('util');


module.exports = function access_database () {

  let path = process.env.haystack_orator_redis_utilities_path;
  let cls = process.env.haystack_orator_redis_utilities_class;
  let parameter = process.env.haystack_orator_redis_utilities_class_parameter;
  let key = process.env.haystack_orator_redis_cred_key;
  let loc = process.env.haystack_orator_redis_cred_loc;

  let compileIt = 'java -cp ' + path + ' ' + cls + ' ' + parameter + ' "' + key + '" ' + loc;

  console.log('child process beginning ...');
  console.log(compileIt);

  //await prepare_access();
  let secret = global_exec_sync(compileIt).toString();
}
