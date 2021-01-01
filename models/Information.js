const { Schema, model } = require('mongoose');

const Information = Schema({
    infoType: String,
    info: {
        type: String,
        default: "Nope"
    },
    updated: {
        type: Boolean,
        default: false
    },
    expired: String,
    list: {
        type: Array,
        default: []
    }
});

module.exports = model("Information", Information, "Information");