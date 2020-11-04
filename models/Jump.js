const { Schema, model } = require('mongoose');

const JumpToggle = Schema({
    guild: String,
    active: {
        default: true,
        type: Boolean
    }
})

module.exports = model('JumpToggle', JumpToggle, 'JumpToggle');