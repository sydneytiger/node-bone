const winston = require('winston');
const bcrypt = require('bcrypt');
const authentication = require('../middleware/authentication');
const express = require('express');
const _ = require('lodash');
const router = express.Router();
const {User, validate} = require('../models/user');

// check logged in user details
router.get('/myself', authentication, async (req, res) => {
    const users = await User.findById(req.user._id).select(['-password', '-registeredDate', '-isAdmin']);
    res.send(users);
});

// create a new login user.
router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if(error) {
        winston.error(error.message);
        return res.status(400).send('Invalid input');
    } 

    let user = await User.findOne({email: req.body.email});
    if(user) return res.status(400).send('User already registered');

    user = new User(_.pick(req.body, ['firstName', 'lastName', 'email', 'password']));
    const salt = await bcrypt.genSalt(8);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = user.generateAuthToken();
    winston.info(token);
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'firstName', 'lastName', 'email']));
});

module.exports = router;