'use strict';

const { model, Schema } = require('mongoose');

const UserData = new Schema({
    discordId: {
        type: String,
        required: 'A user\'s Discord ID is required to create a saved entry'
    },
    token: {
        type: String,
        required: 'An HMAC-SHA Token is required to create a saved entry'
    },
    metabits: {
        type: Number,
        default: 0
    },
    dino_rank: {
        type: Number,
        default: 0
    },
    prestige_rank: {
        type: Number,
        default: 0
    },
    singularity_speedrun_time: {
        type: Number,
        default: null
    },
    all_sharks_obtained: {
        type: Boolean,
        default: false
    },
    all_hidden_achievements_obtained: {
        type: Boolean,
        default: false
    },
    edited_timestamp: {
        type: Number,
        default: Date.now
    }
});

module.exports.UserData = model('UserData', UserData, 'UserData');