const winston = require('winston');

// catch errors happening inside express
module.exports = (err, req, res, next) => {
    winston.error(err.message, err);
    res.status(500).send('system error');
}