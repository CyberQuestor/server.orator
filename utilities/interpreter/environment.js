const global_env = require('node-env-file');

global_env(__dirname + '/.env', {overwrite: true, raise: false});
global_env(__dirname + '/../resources/configuration/.env', {overwrite: true, raise: false});
global_env(__dirname + '/../resources/configuration/configuration.properties', {overwrite: true, raise: false});
global_env('/etc/defaults/haystack', {overwrite: true, raise: false});
global_env('/etc/default/haystack', {overwrite: true, raise: false});
