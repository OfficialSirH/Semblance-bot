const { Schema, model } = require('mongoose');

const Information = Schema({
    infoType: String,
    info: {
        type: String,
        default: "Nope"
    },
    count: {
        type: Number,
        default: 1
    },
    updated: {
        type: Boolean,
        default: false
    },
    expired: String,
    list: {
        type: Array,
        default: []
    },
    footer: {
        type: String,
        default: "Much emptiness"
    }
});

module.exports.Information = model("Information", Information, "Information");