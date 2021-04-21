const { MessageEmbed } = require('discord.js'), {randomColor} = require('../constants'), { currentLogo } = require('../config').default,
    { Information } = require('./edit.js');

module.exports = {
    description: "Info on how to become a beta tester",
    category: 'game',
    usage: {
        "": ""
    },
    aliases: ['betajoin', 'betaform'],
    permissionRequired: 0,
    checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
    let infoHandler = await Information.findOne({ infoType: 'beta' });
    let embed = new MessageEmbed()
        .setTitle('Steps to join beta')
        .setColor(randomColor)
        .attachFiles(currentLogo)
        .setThumbnail("attachment://Current_Logo.png")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setDescription([`Steps to join the beta testing of CelltoSingularity can be found in the form.`,
                            `[Beta Signup Form](https://docs.google.com/document/d/1Ov_XvSn2AN1Q0EVJLgCnxfVkzdn6EL72LH5bhDP-aSc/edit?usp=sharing)`,
                            `Please read the form completely before asking any doubts `,
                            `NOTE: - the beta versions of the game will have a lot of bugs and there is a possibility that you might lose your progress, Enter at your own will.`,
                            `- Cells Support is a person, not a place. You can DM him here => <@647198180911349770>`,
                            `**REMINDER : DO NOT POST YOUR EMAIL IN THE PUBLIC CHAT AND DON'T PING CELLS SUPPORT**`].join('\n'))
        .setFooter(`Called by ${message.author.tag}`);
    message.channel.send(embed);
}