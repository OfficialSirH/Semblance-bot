const fs = require('fs'),
    itemList = JSON.parse(fs.readFileSync('./constants/itemsList.json', "utf8")),
    { nameToScNo, bigToE, checkIfAllowedValue } = require('../constants/largeNumberConversion.js'),
    { MessageEmbed } = require('discord.js'), { randomColor } = require('../constants');

module.exports = {
    description: "",
    category: 'calculator',
    usage: {
        "": ""
    },
    permissionRequired: 0,
    checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
    let itemInput = args[0], curAmount = args[1], currentLevel = args[2];
    if (!itemInput) return message.reply("You forgot input for 'item'.");
    if (!curAmount) return message.reply("You forgot input for 'Currency Amount'.");
    if (!currentLevel || currentLevel < 0) currentLevel = 0;
    itemInput = itemInput.toLowerCase();
    curAmount = checkIfAllowedValue(curAmount, message, 'cost');
    if (isNaN(curAmount)) return;
    
    let itemCost = null;
    let itemCostType;
    
    for (const [key, value] of Object.entries(itemsList)) if (itemsList[key][itemInput]) {
        itemCost = itemsList[key][itemInput].price;
        itemCostType = key;
    }

    if (!itemCost) return message.reply("Your input for 'item' was invalid.");
    let num3 = curAmount * 0.1499999761581421;
    let num5 = itemCost * Math.pow(1.149999976158142, currentLevel);
    let level = Math.floor(Math.log(num3 / num5 + 1) / Math.log(1.149999976158142));

    let embed = new MessageEmbed()
        .setTitle("Item Calculator Results")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(randomColor)
        .setDescription([`Chosen item: ${itemInput}`,
            `Current item level: ${currentLevel}`,
            `currency input: ${bigToE(curAmount)} ${itemCostType}`,
            `Resulting level: ${level}`].join('\n'));
    message.reply(embed);
}