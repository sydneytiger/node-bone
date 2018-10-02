const express = require('express');
const users = require('../routes/users');
const login = require('../routes/login');
const error = require('../middleware/error');

module.exports = (app) => {
    app.use(express.json());
    app.use('/api/users', users);
    app.use('/api/login', login);
    app.use(error);
}