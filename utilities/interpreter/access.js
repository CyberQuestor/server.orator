const global_exec_sync = require('child_process').execSync;
const global_util = require('util');

let path = process.env.haystack_orator_redis_utilities_path;
let cls = process.env.haystack_orator_redis_utilities_class;
let parameter = process.env.haystack_orator_redis_utilities_class_parameter;
let key = process.env.haystack_orator_redis_cred_key;
let loc = process.env.haystack_orator_redis_cred_loc;
let separator = process.env.haystack_orator_redis_separator;

let compileIt = 'java -cp ' + path + ' ' + cls + ' ' + parameter + ' "' + key + '" ' + loc;

//await prepare_access();
let secret = global_exec_sync(compileIt).toString();

if(secret) {
  let splicedSecret = secret.split(separator);
  if(splicedSecret && splicedSecret.length > 0) {
    process.env['redsec'] = splicedSecret[1].toString().trim();
  }

}
