const express = require('express');
const router = express.Router();
const Joi = require('joi');
const winston = require('winston');
const {User} = require('../models/user');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
    const loginModel = {
        email: req.body.email,
        password: req.body.password
    };
    const {error} = validateLoginModel(loginModel);
    if(error)
    {
        winston.info(error.message);
        return res.status(400).send('Invalid login');
    }

    const user = await User.findOne({email: loginModel.email});
    if(!user) return res.status(400).send('Invalid user');
    

    const isValidPassword = await bcrypt.compare(loginModel.password, user.password);
    if(!isValidPassword) return res.status(400).send('Invalid password');

    const token = user.generateAuthToken();

    res.header('x-auth-token', token).send({result: true});
    
});


function validateLoginModel(login) {
    const joiSchema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };

    return Joi.validate(login, joiSchema);
}

module.exports.login = router;
module.exports.validate = validateLoginModel;