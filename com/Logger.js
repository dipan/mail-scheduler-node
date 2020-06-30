const winston = require('winston');
require('winston-daily-rotate-file');

let transportError = new (winston.transports.DailyRotateFile)({
  dirname: './logs',
  filename: 'server_error_%DATE%.log',
  datePattern: 'YYYY-MM',
  level: 'error',
  zippedArchive: true,
  maxSize: '5m'
});

transportError.on('rotate', function (oldFilename, newFilename) {
  // do something fun
  // console.log(oldFileName + " -> " + newFilename);
});

let transportCombined = new (winston.transports.DailyRotateFile)({
  dirname: './logs',
  filename: 'server_combined_%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: false,
  maxSize: '5m'
});

transportCombined.on('rotate', function (oldFilename, newFilename) {
  // do something fun
  // console.log(oldFilename + " -> " + newFilename);
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'your-service-name' },
  transports: [
    //
    // - Write to all logs with level `info` and below to `quick-start-combined.log`.
    // - Write all logs error (and below) to `quick-start-error.log`.
    //
    transportError,
    transportCombined
  ]
});

//
// If we're not in production then **ALSO** log to the `console`
// with the colorized simple format.
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

module.exports = logger;