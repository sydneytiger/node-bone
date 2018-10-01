const moment = require('moment');
const winston = require('winston');
require('winston-daily-rotate-file')
require('express-async-errors');

module.exports = () => {
    const loggingTimeFormat = 'YYYY-MM-DD HH:mm:ss:SSS ZZ';
    winston.handleExceptions(
        new winston.transports.Console({ colorize: true, prettyPrint: true }),
        new winston.transports.DailyRotateFile({ 
            dirname: './logs/',
            filename: '%DATE%-uncaughtExceptions.log',
            datePattern: 'DDMMYYYY',
            timestamp: function () {
                return moment().format(loggingTimeFormat);
            }
        })
    );

    process.on('unhandleRejection', (ex) => {
        throw ex;
    });

    winston.add(winston.transports.DailyRotateFile, {
        name: 'info-log',
        dirname: './logs/',
        filename: '%DATE%-log.log',
        datePattern: 'DDMMYYYY',
        timestamp: function () {
            return moment().format(loggingTimeFormat);
        },
        prepend: true,
        level: 'info'
    });


    winston.add(winston.transports.DailyRotateFile, {
        name: 'error-log',
        dirname: './logs/',
        filename: '%DATE%-error.log',
        datePattern: 'DDMMYYYY',
        timestamp: function () {
            return moment().format(loggingTimeFormat);
        },
        prepend: true,
        level: 'error'
    });
}