const winston = require('winston');
const express = require('express');
const helmet = require('helmet');
const app = express();

app.use(helmet());
require('./startup/logging')();
require('./startup/config')();
require('./startup/db')();
require('./startup/validation')();
require('./startup/routes')(app);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

module.exports = server;