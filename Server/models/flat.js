const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic');

const FlatSchema = new mongoose.Schema({
    Address: {
        type: String,
        default: '',
        unique: true,
        es_indexed: true
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

FlatSchema.plugin(mongoosastic);
module.exports = mongoose.model('Flat', FlatSchema);

