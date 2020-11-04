const { Schema, model } = require('mongoose');

const Game = Schema({
    player: String,
    money: {
        default: 0,
        type: Number
    },
    percentIncrease: Number,
    baseCost: {
        default: 1,
        type: Number
    },
    cost: {
        default: 0,
        type: Number
    },
    level: {
        default: 0,
        type: Number
    },
    checkedLevel: {
        default: 0,
        type: Number
    },
    idleCollection: Number,
    idleProfit: Number
});

module.exports = model('Game', Game, 'games');