import { Message, MessageActionRow, MessageButton } from 'discord.js';
import { Jump } from '@semblance/models';
import { Semblance } from '../structures';

module.exports = {
    description: "This command toggles a feature that will convert a user's message that contains a message link into an embed that provides the details of the specified message link",
    category: 'admin',
    usage: {
        "<true/t or false/f>": ""
    },
    permissionRequired: 5,
    aliases: ['jump', 'jt'],
    checkArgs: (args: string[]) => args.length >= 0
}

module.exports.run = async (client: Semblance, message: Message, args: string[]) => {
    const toggleHandler = await Jump.findOne({ userId: message.author.id });
    const component = new MessageActionRow()
    .addComponents([new MessageButton()
        .setLabel('Enable')
        .setCustomId(JSON.stringify({
            command: 'jumptoggle',
            action: 'enable',
            id: message.author.id
        }))
        .setDisabled(Boolean(toggleHandler?.active))
        .setEmoji('✔')
        .setStyle('SUCCESS'),
        new MessageButton()
        .setLabel('Disable')
        .setCustomId(JSON.stringify({
            command: 'jumptoggle',
            action: 'disable',
            id: message.author.id
        }))
        .setDisabled(!Boolean(toggleHandler?.active))
        .setEmoji('❌')
        .setStyle('DANGER'),
        new MessageButton()
        .setLabel('Cancel')
        .setCustomId(JSON.stringify({
            command: 'jumptoggle',
            action: 'cancel',
            id: message.author.id
        }))
        .setEmoji('🚫')
        .setStyle('PRIMARY')
    ]);
    message.channel.send({ content: 'Jump Toggles:', components: [component] });
}