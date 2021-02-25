const fs = require('fs'),
    itemsList = JSON.parse(fs.readFileSync('./constants/itemsList.json', "utf8")),
    { nameToScNo, bigToE, slash_checkIfAllowedValue } = require('../constants/largeNumberConversion.js'),
    { MessageEmbed } = require('discord.js');

module.exports = {
    permissionRequired: 0
}

module.exports.run = async (client, interaction) => {
    let [itemInput, currentLevel, level] = interaction.data.options.map(o => o.value);

    if (!itemInput) return [{ content: "You forgot input for 'item'.", flags: 1 << 6 }];
    if (!level) return [{ content: "You forgot input for 'level'.", flags: 1 << 6 }];
    if (!currentLevel || currentLevel < 0) currentLevel = 0;
    itemInput = itemInput.toLowerCase();
    level = slash_checkIfAllowedValue(level, 'level');
    if (isNaN(level)) return [{ content: "Your input for 'level' was invalid.", flags: 1 << 6 }];
    currentLevel = slash_checkIfAllowedValue(currentLevel, 'current level');
    if (isNaN(currentLevel)) return [{ content: "Your input for 'current level' was invalid.", flags: 1 << 6 }];;
    
    let itemCost = null;
    let itemCostType;
    
    for (const [key, value] of Object.entries(itemsList)) if (itemsList[key][itemInput]) {
        itemCost = itemsList[key][itemInput].price;
        itemCostType = key;
    }

    if (!itemCost) return [{ content: "Your input for 'item' was invalid.", flags: 1 << 6 }];
    let resultingPrice = 0;
    
    for (let i = currentLevel; i < (level + currentLevel); i++) {
        resultingPrice += itemCost * Math.pow(1.149999976158142, i);
        if (!isFinite(resultingPrice)) break;
    }

    let embed = new MessageEmbed()
        .setTitle("Item Calculator Results")
        .setAuthor(interaction.member.user.tag, interaction.member.user.avatarURL)
        .setColor("RANDOM")
        .setDescription([`Chosen item: ${itemInput}`,
            `Current item level: ${currentLevel}`,
            `Item level goal: ${level + currentLevel}`,
            `Resulting Price: ${bigToE(resultingPrice)} ${itemCostType}`].join('\n'));
    return [{ embeds: [embed.toJSON()] }];
}