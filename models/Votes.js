const { Schema, model } = require('mongoose');

const Votes = Schema({
    user: String,
    voteCount: {
        default: 1,
        type: Number
    }
})

module.exports.Votes = model('Votes', Votes, 'Votes');