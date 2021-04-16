import { Schema, model } from 'mongoose';

const Report = new Schema({
    User: String,
    bugID: Number,
    messageID: String,
    channelID: String
});

module.exports = model('Reports', Report, 'Reports');