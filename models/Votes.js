const { Schema, model } = require('mongoose');

const Votes = Schema({
    user: String,
    voteCount: {
        default: 1,
        type: Number
    }
})

module.exports = model('Votes', Votes, 'Votes');