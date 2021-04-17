"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Report = void 0;
const mongoose_1 = require("mongoose");
const ReportSchema = new mongoose_1.Schema({
    User: String,
    bugID: Number,
    messageID: String,
    channelID: String
});
exports.Report = mongoose_1.model('Reports', ReportSchema, 'Reports');
