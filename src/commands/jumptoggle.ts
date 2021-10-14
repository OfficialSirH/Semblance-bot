import { MessageActionRow, MessageButton } from 'discord.js';
import type { Message } from 'discord.js';
import { Jump } from '@semblance/models';
import type { Semblance } from '../structures';
import type { Command } from '@semblance/lib/interfaces/Semblance';
import { messageLinkRegex } from '../constants';

export default {
    description: "This command toggles a feature that will convert a user's message that contains a message link into an embed that provides the details of the specified message link",
    category: 'admin',
    usage: {
        "<true/t or false/f>": ""
    },
    permissionRequired: 1,
    aliases: ['jump', 'jt'],
    checkArgs: () => true,
    run: (client, message, args) => run(client, message, args)
} as Command<'admin'>;

const run = async (client: Semblance, message: Message, args: string[]) => {
    if (args[0]?.match(messageLinkRegex)) return require('../autoActions/jump').run(client, message, [args[0]], 1);
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