const fs = require('fs'),
    itemsList = JSON.parse(fs.readFileSync('./constants/itemsList.json', "utf8")),
    { nameToScNo, bigToE, checkIfAllowedValue } = require('../constants/largeNumberConversion.js'),
    { MessageEmbed } = require('discord.js'), { randomColor } = require('../constants');

module.exports = {
    description: "",
    usage: {
        "": ""
    },
    permissionRequired: 0,
    checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
    let itemInput = args[0], level = args[1], currentLevel = args[2];
    if (!itemInput) return message.reply("You forgot input for 'item'.");
    if (!level) return message.reply("You forgot input for 'level'.");
    if (!currentLevel || currentLevel < 0) currentLevel = 0;
    itemInput = itemInput.toLowerCase();
    level = checkIfAllowedValue(level, message, 'level');
    if (isNaN(level)) return;
    currentLevel = checkIfAllowedValue(currentLevel, message, 'current level');
    if (isNaN(currentLevel)) return;
    let itemCost = null;
    let itemCostType;
    for (const [key, value] of Object.entries(itemsList)) if (itemsList[key][itemInput]) {
        itemCost = itemsList[key][itemInput].price;
        itemCostType = key;
    }
    if (!itemCost) return message.reply("Your input for 'item' was invalid.");
    let resultingPrice = 0;
    for (let i = currentLevel; i < (level + currentLevel); i++) {
        resultingPrice += itemCost * Math.pow(1.149999976158142, i);
        if (!isFinite(resultingPrice)) break;
    }
    // Math.floor(Math.log(resultingPrice)) =  itemCost * (level*Math.log(1.15));
    // (Math.floor(Math.log(resultingPrice) / itemCost)) = level*Math.log(1.15);
    // (Math.floor(Math.log(resultingPrice) / itemCost) / Math.log(1.15)) = level;
    let embed = new MessageEmbed()
        .setTitle("Item Calculator Results")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(randomColor)
        .setDescription([`Chosen item: ${itemInput}`,
            `Current item level: ${currentLevel}`,
            `Item level goal: ${level + currentLevel}`,
            `Resulting Price: ${bigToE(resultingPrice)} ${itemCostType}`].join('\n'));
    message.reply(embed);
}