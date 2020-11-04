const { MessageEmbed } = require('discord.js');

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
    var metabits = args[0];
    var dinoRanks = (args[1] > 550) ? 550 : args[1];
    var num = 1.0;
    if (metabits > 1000.0) {
        var num2 = metabits - 1000.0;
        num += 10.0;
        if (num2 > 100000.0) {
            var num3 = num2 - 100000.0;
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
    var dinoranksMulti = 1 + args[1] * 0.02;
    num *= dinoranksMulti;
    var simspeed = (args[2] > 1400) ? 1400 : args[2];
    num *= ((simspeed/100)+1);
    message.reply(`${metabits} metabits, an accumulation of ${dinoRanks} meso ranks, and ${simspeed}% in simulation speed upgrades would give you a production multiplier of x${num}.`);
}
