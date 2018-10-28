const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic');

const FlatSchema = new mongoose.Schema({
    Address: {
        type: String,
        default: '',
        unique: true,
        es_indexed: true,
        es_type: 'string',
        es_analyzer: 'russian',
        index: 'analyzed',
    },
    Price: {
        type: Number,
        default: '',
        es_indexed: true,
        es_type: 'integer',
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
        default: new Date(),
        es_indexed: true,
        es_type: 'date',
    },
    URL: {
        type: String,
        default: '',
        unique: true
    }
});

FlatSchema.plugin(mongoosastic);
module.exports = mongoose.model('Flat', FlatSchema);

