const bcrypt = require("bcrypt");
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    token: {
      type: String
    },
    login: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    favoriteFlats: {
        type: Array,
        default: []
    },
});

UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
