const { createLogger, format, transports } = require ('winston');
const { combine, timestamp, label, printf } = format;
require('winston-daily-rotate-file');
const path = require ('path');
const fs = require('fs');
const mkdirs = require('node-mkdirs');
const ResponseCode = require('./rode.js').fetchResponseCode();
let winstonLogger = createLogger;

module.exports = {

  initializeLogger: function () {

    // get the path right
    // check if its defined somewhere
    let logLevel = process.env.haystack_orator_log_level;
    let pathToLog = process.env.haystack_orator_path_to_log;

    logLevel = logLevel ? logLevel : 'info';
    pathToLog = pathToLog ? pathToLog : '/var/log/haystack/orator/logs/';

    if (!fs.existsSync(pathToLog)) {
      mkdirs(pathToLog);
    }

    let localTransports = [];

    // configure transports
    localTransports.push(new transports.DailyRotateFile({
      filename: 'haystack_%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      filename: path.join(pathToLog, 'haystack_%DATE%.log'),
      maxFiles: '179d',
      maxSize: '17m',
      handleExceptions: true,
      exitOnError: false
    }));

    let formatAlignedWithColorsAndTime = format.combine(
      format.colorize(),
      format.timestamp(),
      format.align(),
      format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    );

    winstonLogger = createLogger({
      level: logLevel,
      format: formatAlignedWithColorsAndTime,
      transports: localTransports
    });

    //
    // If we're not in production then log to the `console` with the format:
    // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
    //
    if (process.env.NODE_ENV !== 'production') {
      winstonLogger.add(new transports.Console({
        format: formatAlignedWithColorsAndTime,
        level: 'silly',
        handleExceptions: true,
        exitOnError: false
      }));
    }

    winstonLogger.info('Successfully loaded logger!');
    winstonLogger.silly('Logging to path: ' + pathToLog);
    winstonLogger.silly('Logging at level: ' + logLevel);

    return winstonLogger;
  },

  // support info, silly, debug and error
  fetchLogger: function (moduleName) {
    function getLabel() {
        let parts = moduleName.split('/');
        return parts[parts.length - 2] + '/' + parts.pop();
    };

    let fileLogger = {
        error: function(rode, object) {
            winstonLogger.error(' [' + getLabel() + '] ' + ': ' + extractTextToLog(rode), object);
        },
        info: function(rode, object) {
            winstonLogger.info(' [' + getLabel() + '] ' + ': ' + extractTextToLog(rode), object);
        },
        debug: function(rode, object) {
            winstonLogger.debug(' [' + getLabel() + '] ' + ': ' + extractTextToLog(rode), object);
        },
        silly: function(rode, object) {
            winstonLogger.silly(' [' + getLabel() + '] ' + ': ' + extractTextToLog(rode), object);
        }
    }

    function extractTextToLog(rode) {
      let textToLog = '';
      if(typeof rode == 'object') {
        textToLog = rode.value
      } else if(typeof rode == 'string') {
        textToLog = rode;
      } else {
        textToLog = 'Rode is not supported for logging yet!';
      }
      return textToLog;
    }

    return fileLogger;
  }

}
