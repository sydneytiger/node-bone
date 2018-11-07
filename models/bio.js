const mongoose = require('mongoose');
const Joi = require('joi');

const bioSchema = new mongoose.Schema({
    weight: {
        // in kelograms
        type: Number
    },
    bodyFatPercentage: {
        type: Number
    },
    chestCircumference: {
        // in millionmeter
        type: Number
    },
    armCircumference: {
        // in millionmeter
        type: Number
    },
    waistCircumference: {
        // in millionmeter
        type: Number
    },
    measureDate: {
        type: Date,
        default: Date.now
    }
});

const Bio = mongoose.model('Bio', bioSchema);

function validateBio(bio) {
    const schema = {
        weight: Joi.number().min(20).max(300).required(),
        bodyFatPercentage: Joi.number().min(0).max(100),
        chestCircumference: Joi.number().min(0).max(1000),
        armCircumference: Joi.number().min(0).max(1000),
        waistCircumference: Joi.number().min(0).max(1000)
    };

    return Joi.validate(bio, schema);
}

exports.Bio = Bio;
exports.bioSchema = bioSchema;
exports.validate = validateBio;