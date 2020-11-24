const { Schema, model } = require('mongoose');

const Afk = Schema({
    userID: String,
    reason: {
        type: String,
        default: "Just because"
    }
})

module.exports = model("Afk", Afk, "Afk");