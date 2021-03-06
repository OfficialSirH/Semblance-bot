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
    const toggleHandler = await Jump.findOne({ guild: message.guild.id });
    const component = new MessageActionRow()
    .addComponents([new MessageButton()
        .setLabel('Enable')
        .setCustomId(JSON.stringify({
            command: 'jumptoggle',
            action: 'enable',
            id: message.author.id
        }))
        .setDisabled(Boolean(toggleHandler.active))
        .setEmoji('✔')
        .setStyle('SUCCESS'),
        new MessageButton()
        .setLabel('Disable')
        .setCustomId(JSON.stringify({
            command: 'jumptoggle',
            action: 'disable',
            id: message.author.id
        }))
        .setDisabled(!Boolean(toggleHandler.active))
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
    /*let choice = args[0].toLowerCase();
    if (choice == 't' || choice == 'true') {
        if (toggleHandler && toggleHandler.active) message.reply("You've already got `jump` enabled on this guild.");
        else if (toggleHandler && !toggleHandler.active) {
            await Jump.findOneAndUpdate({ guild: message.guild.id }, { $set: { active: true } });
            message.channel.send("Jump message converter is now **active**.");
        } else {
            await (new Jump({ guild: message.guild.id })).save();
            message.channel.send("Jump message converter is now **active**.");
        }
    } else if (choice == 'f' || choice == 'false') {
        if (toggleHandler && !toggleHandler.active) message.reply("You've already got `jump` disabled on this guild.");
        else if (toggleHandler && toggleHandler.active) {
            await Jump.findOneAndUpdate({ guild: message.guild.id }, { $set: { active: false } });
            message.channel.send("Jump message converter is now **inactive**.");
        } else message.channel.send("Disabling this isn't required as it is disabled by default.");
    } else message.reply("Incorrect argument, the allowed arguments are true/t or false/f");*/
}