const { MessageEmbed } = require('discord.js'), {randomColor} = require('../constants'),
    { currentLogo, prefix } = require('../config.js');

module.exports = {
    description: "List of all Cell to Singularity related commands",
    category: 'help',
    usage: {
        '': ''
    },
    permissionRequired: 0,
    checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
    const c2sCommands = Object.keys(client.commands).filter(key => client.commands[key].category == 'game').map(key => `**\`${prefix}${key}\`**`);
    let embed = new MessageEmbed()
        .setTitle("**-> Cell to Singularity Commands**")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(randomColor)
        .attachFiles(currentLogo)
        .setThumbnail(currentLogo.name)
        .setDescription(c2sCommands.join(', '))
        .setFooter("C2S for the win!");
    message.channel.send(embed);
}