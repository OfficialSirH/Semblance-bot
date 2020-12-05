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
    }
});

module.exports = model("Information", Information, "Information");