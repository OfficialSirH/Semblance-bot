const { MessageEmbed } = require('discord.js'), randomColor = require('../constants/colorRandomizer.js'),
{ sirhGuildID } = require('../config.js');

module.exports = {
  description: "This command will give you the the notification role for Semblance announcements",
  usage: {
    "<add/remove>": "Gives the notification role or removes it depending on if you typed 'add' or 'remove'"
  },
  permissionRequired: 0,
  checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
  if (message.guild.id != sirhGuildID) return message.reply("This command is exclusive to SirH's server.");
  let sembNotifications = message.guild.roles.cache.find(r => r.name == "Semblance Notifications");
  let hasRole = message.member.roles.cache.has(sembNotifications.id);
  if (args[0] == 'remove' && hasRole) {
    return message.member.roles.remove(sembNotifications)
    .then(msg => msg.reply("Your role was successfully removed"));
  }
  else if (args[0] == 'remove') return message.reply("You currently do not have the role.");
  else if (args[0] == 'add' && hasRole) return message.reply("You currently have the role.");
  else if (args[0] == 'add') {
    return message.member.roles.add(sembNotifications)
    .then(msg => msg.reply("Your role was successfully added"));
  }
  else return message.reply(new MessageEmbed().setTitle("Semblance Notifications")
                            .setDescription(`${module.exports.description}\n`+
                            `**How to use:** type \`add\` at the end to get role or \`remove\` to remove it.`));
}
