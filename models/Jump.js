const { Schema, model } = require('mongoose');

const JumpToggle = Schema({
    guild: String,
    active: {
        default: true,
        type: Boolean
    }
})

module.exports.Jump = model('JumpToggle', JumpToggle, 'JumpToggle');