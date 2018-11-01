const mongoose = require('mongoose');
const Joi = require('joi');

const bioSchema = new mongoose.Schema({
    height: {
        type: Number
    },
    weight: {
        type: Number
    },
    bodyFatPercentage: {
        type: Number
    },
    chestCircumference: {
        type: Number
    },
    armCircumference: {
        type: Number
    },
    waistCircumference: {
        type: Number
    },
    measureDate: {
        type: Date,
        default: Date.now
    }
});

exports.bioSchema = bioSchema;