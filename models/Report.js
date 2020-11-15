const { Schema, model } = require('mongoose');

const Report = Schema({
    User: String,
    bugID: Number,
    messageID: String,
    channelID: String
});

module.exports = model('Reports', Report, 'Reports');