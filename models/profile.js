const mongoose = require('mongoose');
const Joi = require('joi');

const profileSchema = new mongoose.Schema({
    dateOfBirth: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    yearStart: {
        type: Number
    }
});

const Profile = mongoose.model('Profile', profileSchema);

function validateProfile(profile) {
    const year = new Date().getFullYear();
    const schema = {
        dateOfBirth: Joi.date().max('now').required(),
        gender: Joi.string().required(),
        yearStart: Joi.number().min(year - 40).max(year)
    };

    return Joi.validate(profile, schema);
}

exports.Porfile = Profile;
exports.profileSchema = profileSchema;
exports.validate = validateProfile;