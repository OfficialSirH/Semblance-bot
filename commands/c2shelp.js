const { MessageEmbed } = require('discord.js'), {randomColor} = require('../constants'),
    { currentLogo, prefix } = require('../config').default;

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
    // const c2sCommands = Object.keys(client.commands).filter(key => client.commands[key].category == 'game').map(key => `**\`${prefix}${key}\`**`);
    const mainCommands = cmdsToList(client, 'main');
    const mesozoicCommands = cmdsToList(client, 'mesozoic');
    const otherCommands = cmdsToList(client, 'other');
    let embed = new MessageEmbed()
        .setTitle("**-> Cell to Singularity Commands**")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(randomColor)
        .attachFiles(currentLogo)
        .setThumbnail(currentLogo.name)
        // .setDescription(c2sCommands.join(', '))
        .addFields([
            { name: 'Main Simulation', value: mainCommands, inline: true },
            { name: 'Mesozoic Valley', value: mesozoicCommands, inline: true },
            { name: '\u200b', value: '\u200b' },
            { name: 'Other/Extras', otherCommands: otherCommands, inline: true }
        ])
        .setFooter("C2S for the win!");
    message.channel.send(embed);
}

function cmdsToList(client, subcategory) {
    return Object.keys(client.commands)
        .filter(key => client.commands[key].category == 'game' && client.commands[key].subcategory == subcategory)
        .map(key => `**\`${prefix}${key}\`**`).join(', ');
}