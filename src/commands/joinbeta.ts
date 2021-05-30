import { Message, MessageEmbed } from 'discord.js';
import { randomColor } from '@semblance/constants';
import config from '@semblance/config';
import { Information } from '@semblance/models';
import { Semblance } from '../structures';
const { currentLogo } = config;

module.exports = {
    description: "Info on how to become a beta tester",
    category: 'game',
    subcategory: 'other',
    usage: {
        "": ""
    },
    aliases: ['betajoin', 'betaform'],
    permissionRequired: 0,
    checkArgs: (args: string[]) => args.length >= 0
}

module.exports.run = async (client: Semblance, message: Message, args: string[]) => {
    let infoHandler = await Information.findOne({ infoType: 'beta' });
    let embed = new MessageEmbed()
        .setTitle('Steps to join beta')
        .setColor(randomColor)
        .attachFiles([currentLogo])
        .setThumbnail(currentLogo.name)
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setFooter(`Called by ${message.author.tag}`);

        if (infoHandler.info?.toLowerCase() == 'none') embed.setDescription("There's no beta currently so there's no beta joining available.");
        else embed.setDescription([`Steps to join the beta testing of CelltoSingularity can be found in the form.`,
                            `[Beta Signup Form](https://docs.google.com/document/d/1Ov_XvSn2AN1Q0EVJLgCnxfVkzdn6EL72LH5bhDP-aSc/edit?usp=sharing)`,
                            `Please read the form completely before asking any doubts `,
                            `NOTE: - the beta versions of the game will have a lot of bugs and there is a possibility that you might lose your progress, Enter at your own will.`,
                            `- Cells Support is a person, not a place. You can DM him here => <@647198180911349770>`,
                            `**REMINDER : DO NOT POST YOUR EMAIL IN THE PUBLIC CHAT AND DON'T PING CELLS SUPPORT**`].join('\n'))
    message.channel.send(embed);
}