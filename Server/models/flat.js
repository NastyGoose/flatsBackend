const mongoose = require('mongoose');

const FlatSchema = new mongoose.Schema({
    Address: {
        type: String,
        default: '',
        unique: true
    },
    Price: {
        type: Number,
        default: ''
    },
    Description: {
        type: String,
        default: ''
    },
    Photo: {
        type: String,
        default: ''
    },
    AddDate: {
        type: Date,
        default: new Date()
    },
    UpdateDate: {
        type: Date,
        default: new Date()
    },
    URL: {
        type: String,
        default: '',
        unique: true
    }
});

module.exports = mongoose.model('Flat', FlatSchema);

