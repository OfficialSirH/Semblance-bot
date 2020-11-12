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
    let itemInput = args[0], curAmount = args[1], currentLevel = args[2];
    if (!itemInput) return message.reply("You forgot input for 'item'.");
    if (!curAmount) return message.reply("You forgot input for 'Currency Amount'.");
    if (!currentLevel || currentLevel < 0) currentLevel = 0;
    itemInput = itemInput.toLowerCase();
    curAmount = checkIfAllowedValue(curAmount, message, 'cost');
    if (isNaN(curAmount)) return;
    let itemCost = null;
    let itemCostType;
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
        })
    }
    if (!itemCost) return message.reply("Your input for 'item' was invalid.");
    let num3 = curAmount * 0.1499999761581421;
    let num5 = itemCost * Math.pow(1.149999976158142, currentLevel);
    let level = Math.floor(Math.log(num3 / num5 + 1) / Math.log(1.149999976158142));
    message.reply(`${bigToE(curAmount)} ${itemCostType} would give you ${level} levels of ${itemInput} starting at level ${currentLevel}.`);
}