const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const config = require('config');
const moment = require('moment');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    lastName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    registeredDate: {
        type: Date,
        default: Date.now
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isVip: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign(
        {
            _id: this._id, 
            firstName:this.firstName, 
            lastName:this.lastName, 
            email:this.email, 
            isAdmin: this.isAdmin, 
            isVip: this.isVip
        }, 
        config.get('authTokenKey'),
        {
            expiresIn: '10m'
        });
    return token;
}

userSchema.statics.isEmailRegistered = async function(email) {
    const user = await this.findOne({
        'email':email
    });

    console.log(user);
    return user ? true : false;
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const joiSchema = {
        firstName: Joi.string().min(3).max(50).required(),
        lastName: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
    };

    return Joi.validate(user, joiSchema);
}


module.exports.User = User;
module.exports.validate = validateUser;