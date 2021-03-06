const mongoose = require('mongoose');
const winston = require('winston');
const bcrypt = require('bcrypt');
const authentication = require('../middleware/authentication');
const express = require('express');
const _ = require('lodash');
const router = express.Router();
const {
    User,
    validate
} = require('../models/user');
const {
    validate: profileValidate
} = require('../models/profile');
const {
    Bio,
    validate: bioValidate
} = require('../models/bio');

// check logged in user details
router.get('/myself', authentication, async (req, res) => {
    const users = await User.findById(req.user._id).select(['-password', '-registeredDate', '-isAdmin']);
    res.send(users);
});

// create a new login user.
router.post('/', async (req, res) => {
    const {
        error
    } = validate(req.body);
    if (error) {
        winston.error(error.message);
        return res.status(400).send('Invalid input');
    }

    let user = await User.findOne({
        email: req.body.email
    });
    if (user) return res.status(400).send('User already registered');

    user = new User(_.pick(req.body, ['_id', 'firstName', 'lastName', 'email', 'isAdmin', 'isVip']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    await user.save();

    const token = user.generateAuthToken();
    winston.info(token);
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'firstName', 'lastName', 'email', 'isAdmin', 'isVip']));
});

// retrieve user profile details
router.get('/profile', authentication, async (req, res) => {
    const user = await User.findOne({
        _id: req.user._id
    });
    res.send(user.profile);
});

// create user profile
router.post('/profile', authentication, async (req, res) => {
    const {
        error
    } = profileValidate(req.body);
    if (error) {
        winston.error(error.message);
        return res.status(400).send('Invalid input');
    } // TODO: refactor it to middleware

    try {
        const user = await User.findOne({
            _id: req.user._id
        });
        user.profile = req.body;
        user.save();
        return res.send('profile update success');
    } catch (ex) {
        winston.error(ex.message);
        res.status(400).send('profile update fail');
    }
});

// update user profile
router.put('/profile', authentication, async (req, res) => {
    const {
        error
    } = profileValidate(req.body);
    if (error) {
        winston.error(error.message);
        return res.status(400).send('Invalid input');
    }

    try {

        await User.update({
            _id: req.user._id
        }, {
            $set: {
                'profile.dateOfBirth': req.body.dateOfBirth,
                'profile.gender': req.body.gender,
                'profile.yearStart': req.body.yearStart
            }
        });
        return res.send('profile  update success');
    } catch (ex) {
        winston.error(ex.message);
        res.status(400).send('profile update fail');
    }

});

// retrieve user bios
router.get('/bio', authentication, async (req, res) => {
    const user = await User
        .findOne({
            _id: req.user._id
        })
        .populate('bio')
        .select('bios');
    const bioIds = user.bios.map(m => mongoose.Types.ObjectId(m));
    const bios = await Bio.find({
        _id: {
            $in: bioIds
        }
    });
    res.send(bios);
});

// create a user bio
router.post('/bio', authentication, async (req, res) => {
    const {
        error
    } = bioValidate(req.body);
    if (error) {
        winston.error(error.message);
        return res.status(400).send('Invalid input');
    }

    try {
        bio = new Bio(_.pick(req.body, ['_id', 'weight', 'bodyFatPercentage', 'chestCircumference', 'armCircumference', 'waistCircumference']));

        await bio.save();
        const user = await User.findOne({
            _id: req.user._id
        });
        user.bios.push(bio);
        user.save();
        return res.send('bio create success');
    } catch (ex) {
        winston.error(ex.message);
        res.status(400).send('bio create fail');
    }

});

// update a user bio
router.put('/bio', authentication, async (req, res) => {

});

// delete a user bio
router.delete('/bio', authentication, async (req, res) => {

});

module.exports = router;