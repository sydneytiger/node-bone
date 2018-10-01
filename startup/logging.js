const winston = require('winston');
require('winston-daily-rotate-file')
require('express-async-errors');

module.exports = function() {
    winston.handleExceptions(
        new winston.transports.Console({ colorize: true, prettyPrint: true }),
        new winston.transports.DailyRotateFile({ 
            dirname: './logs/',
            filename: '%DATE%-uncaughtExceptions.log',
            datePattern: 'DDMMYYYY'
        })
    );

    process.on('unhandleRejection', (ex) => {
        throw ex;
    });

    winston.add(winston.transports.DailyRotateFile, {
        dirname: './logs/',
        filename: '%DATE%-log.log',
        datePattern: 'DDMMYYYY',
        prepend: true
    });
}