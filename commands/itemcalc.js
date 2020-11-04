const fs = require('fs'),
    itemList = JSON.parse(fs.readFileSync('./commands/itemsList.json', "utf8")),
    { nameToScNo, bigToE, checkIfAllowedValue } = require('../constants/largeNumberConversion.js');

module.exports = {
    description: "",
    usage: {
        "": ""
    },
    permissionRequired: 0,
    checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
    var itemInput = args[0], level = args[1], currentLevel = args[2];
    if (!itemInput) return message.reply("You forgot input for 'item'.");
    if (!level) return message.reply("You forgot input for 'level'.");
    if (!currentLevel || currentLevel < 0) currentLevel = 0;
    itemInput = itemInput.toLowerCase();
    level = checkIfAllowedValue(level, message, 'level');
    if (isNaN(level)) return;
    currentLevel = checkIfAllowedValue(currentLevel, message, 'current level');
    if (isNaN(currentLevel)) return;
    var itemCost = null;
    var itemCostType;
    itemList.entropy.forEach(item => {
        if (item.name == itemInput) {
            itemCost = item.price;
            itemCostType = "entropy";

        }
    });
    if (!itemCost) {
        itemList.ideas.forEach(item => {
            if (item.name == itemInput) {
                itemCost = item.price;
                itemCostType = "ideas";
            }
        });
    }
    if (!itemCost) {
        itemList.fossils.forEach(item => {
            if (item.name == 'tyrannosaurus-rex' && itemInput == 'trex') {
                itemCost = item.price;
                itemCostType = 'fossils';
            }
            if (item.name == itemInput) {
                itemCost = item.price;
                itemCostType = "fossils";
            }
        });
    }
    if (!itemCost) return message.reply("Your input for 'item' was invalid.");
    var resultingPrice = 0;
    for (var i = currentLevel; i < (level + currentLevel); i++) {
        resultingPrice += itemCost * Math.pow(1.149999976158142, i);
        if (!isFinite(resultingPrice)) break;
    }
    // Math.floor(Math.log(resultingPrice)) =  itemCost * (level*Math.log(1.15));
    // (Math.floor(Math.log(resultingPrice) / itemCost)) = level*Math.log(1.15);
    // (Math.floor(Math.log(resultingPrice) / itemCost) / Math.log(1.15)) = level;
    message.reply(`The cost for ${level} levels of ${itemInput} is ${bigToE(resultingPrice)} ${itemCostType} starting at level ${currentLevel}.`);
}