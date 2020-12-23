const { Schema, model } = require('mongoose');

const CommandCounter = Schema({
    userID: String,
    commands: {
        default: {},
        type: Object
    }
});

module.exports = model('CommandCounter', CommandCounter, 'CommandCounter')