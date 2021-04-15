'use strict';

const { model, Schema } = require('mongoose');

const UserData = new Schema({
    discordId: {
        type: String,
        required: 'A user\'s Discord ID is required to create a saved entry'
    },
    // playerId: {
    //     type: String,
    //     required: 'A player ID is required to create a saved entry'
    // },
    // playerToken: {
    //     type: String,
    //     required: 'A player token is required to create a saved entry'
    // },
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

module.exports = model('UserData', UserData, 'UserData');