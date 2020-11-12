const { MessageEmbed } = require('discord.js'), { bigToE, checkIfAllowedValue } = require('../constants/largeNumberConversion.js');

module.exports = {
    description: "Provides the production multiplier when given metabit input.",
    usage: {
        "<metabits>": "Inputting any number of metabits will output the production multiplier."
    },
    permissionRequired: 0,
    checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
    if (args.length == 0) return message.reply(`The usage of this command is metaspeedcalc <metabits> <total meso ranks accumulated> <simulation speed upgrades percentage>`);
    if (args.length == 1) return message.reply('You forgot input for `accumulated meso ranks` and `sim speed upgrades percentage`');
    if (args.length == 2) return message.reply('You forgot input for `sim speed upgrades percentage`');
    let metabits = checkIfAllowedValue(args[0], message, 'metabits');
    let dinoRanks = (Math.floor(args[1].replace(/\D/g, '')) > 550) ? 550 : Math.floor(args[1].replace(/\D/g, ''));
    let num = 1.0;
    if (metabits > 1000.0) {
        let num2 = metabits - 1000.0;
        num += 10.0;
        if (num2 > 100000.0) {
            let num3 = num2 - 100000.0;
            num += 10.0;
            num += num3 * 0.009999999776482582 / 10000.0;
        }
        else {
            num += num2 * 0.009999999776482582 / 100.0;
        }
    }
    else {
        num += metabits * 0.009999999776482582;
    }
    let dinoranksMulti = 1 + Math.floor(args[1].replace(/\D/g, '')) * 0.02;
    num *= dinoranksMulti;
    let simspeed = (Math.floor(args[2].replace(/\D/g, '')) > 1400) ? 1400 : Math.floor(args[2].replace(/\D/g, ''));
    num *= ((simspeed/100)+1);
    message.reply(`${metabits} metabits, an accumulation of ${dinoRanks} meso ranks, and ${simspeed}% in simulation speed upgrades would give you a production multiplier of x${bigToE(num)}.`);
}
