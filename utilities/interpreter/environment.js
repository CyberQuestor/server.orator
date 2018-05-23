var env = require('node-env-file');

env(__dirname + '/.env', {overwrite: true, raise: false});
env(__dirname + '/../resources/configuration/.env', {overwrite: true, raise: false});
env(__dirname + '/../resources/configuration/configuration.properties', {overwrite: true, raise: false});
env('/etc/defaults/haystack', {overwrite: true, raise: false});
env('/etc/default/haystack', {overwrite: true, raise: false});
