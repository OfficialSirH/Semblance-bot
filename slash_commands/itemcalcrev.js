const fs = require('fs'),
    itemsList = JSON.parse(fs.readFileSync('./constants/itemsList.json', "utf8")),
    { nameToScNo, bigToE, slash_checkIfAllowedValue } = require('../constants/largeNumberConversion.js'),
    { MessageEmbed } = require('discord.js');

module.exports = {
    permissionRequired: 0
}

module.exports.run = async (client, interaction) => {
    let [itemInput, currentLevel, curAmount] = interaction.data.options.map(o => o.value);
    
    if (!itemInput) return [{ content: "You forgot input for 'item'.", flags: 1 << 6 }];
    if (!curAmount) return [{ content: "You forgot input for 'Currency Amount'.", flags: 1 << 6 }];
    if (!currentLevel || currentLevel < 0) currentLevel = 0;
    itemInput = itemInput.toLowerCase();
    curAmount = slash_checkIfAllowedValue(curAmount, 'cost');
    if (isNaN(curAmount)) return [{ content: "Your input for 'currency' is invalid.", flags: 1 << 6 }];
    
    let itemCost = null;
    let itemCostType;
    
    for (const [key, value] of Object.entries(itemsList)) if (itemsList[key][itemInput]) {
        itemCost = itemsList[key][itemInput].price;
        itemCostType = key;
    }

    if (!itemCost) return [{ content: "Your input for 'item' was invalid.", flags: 1 << 6 }];
    let num3 = curAmount * 0.1499999761581421;
    let num5 = itemCost * Math.pow(1.149999976158142, currentLevel);
    let level = Math.floor(Math.log(num3 / num5 + 1) / Math.log(1.149999976158142));

    let embed = new MessageEmbed()
        .setTitle("Item Calculator Results")
        .setAuthor(interaction.member.user.tag, interaction.member.user.avatarURL)
        .setColor("RANDOM")
        .setDescription([`Chosen item: ${itemInput}`,
            `Current item level: ${currentLevel}`,
            `currency input: ${bigToE(curAmount)} ${itemCostType}`,
            `Resulting level: ${level}`].join('\n'));
    return [{ embeds: [embed.toJSON()] }];
}