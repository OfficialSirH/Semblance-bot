const { MessageEmbed } = require('discord.js'), {randomColor} = require('../constants');

module.exports = {
  description: "Provides link to Semblance's Trello Board",
  usage: {
      "": ""
  },
  permissionRequired: 0,
  checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
  let embed = new MessageEmbed()
    .setDescription("[Semblance's Trello board](https://trello.com/b/Zhrs5AaN/semblance-project)")
    .setColor(randomColor);
  message.channel.send(embed);
} 
