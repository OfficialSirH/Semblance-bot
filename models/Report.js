"use strict";

const { Schema, model }= require("mongoose");

const ReportSchema = new Schema({
    User: String,
    bugID: Number,
    messageID: String,
    channelID: String
});

module.exports.Report = model('Reports', ReportSchema, 'Reports');
