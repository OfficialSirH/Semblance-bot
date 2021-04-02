'use strict';

const { model, Schema } = require('mongoose');

const UserData = new Schema({
    discordId: { 
        type: String,
        required: 'A user\'s Discord ID is required to create a saved entry'
    },
    playerId: { 
        type: String,
        required: 'A player ID is required to create a saved entry'
    },
    playerToken: { 
        type: String,
        required: 'A player token is required to create a saved entry'
    },
    metabits: { 
        type: Number,
        default: 0
    },
    edited_timestamp: {
        type: Number,
        default: Date.now
    }
});

module.exports = model('UserData', UserData, 'UserData');