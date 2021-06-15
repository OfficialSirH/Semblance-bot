import { MessageEmbed, Util, Message, Snowflake, MessageAttachment, TextChannel, GuildChannel } from 'discord.js';
import { parseArgs, messageLinkRegex, attachmentLinkRegex } from '@semblance/constants';
import { Jump } from '@semblance/models';
import { Semblance } from '@semblance/structures';

module.exports = {
    description: "Converts message links to an embed",
    usage: {
        "<MsgLink>":""
    },
    permissionRequired: 0,
    checkArgs: (args: string[]) => args.length >= 0
}

module.exports.run = async function(client: Semblance, message: Message, args: string[], recursiveCount = 0) {
    const jumpHandler = await Jump.findOne({ guild: message.guild.id });
    if (recursiveCount == 2) return message.delete();
    if (!jumpHandler || !jumpHandler.active) return;
    
    let content = args.join(" ");

    const link = messageLinkRegex.exec(content);
    if (link == null) return recursiveCount > 0 ? message.delete() : undefined; 
    const { groups: { guildID, channelID, messageID } } = link as unknown as messageLink;

    client.guilds.fetch(guildID).then(guild => {
        let channel = guild.channels.cache.get(channelID);
        if ((channel as TextChannel)!.nsfw ?? guild.id != message!.guild!.id) return;

        if (recursiveCount == 0) message.content.replace(messageLinkRegex, '').length == 0 ? 
            undefined : message.channel.send(Util.removeMentions(message.content.replace(messageLinkRegex, '')));

        (channel as TextChannel)!.messages.fetch(messageID).then(async (msg) => {
            let attachmentLink = /https?:\/\/(?:cdn\.)?discord(?:app)?\.com\/attachments\/\d{17,19}\/\d{17,20}\/(?<name>\w*\W*)(?:\.png|\.jpg|\.jpeg|\.webp|\.gif)/i.exec(msg.content);
            if (attachmentLink != null)
                msg.content = msg.content.replace(attachmentLink[0], ``);

            let embed = new MessageEmbed()
                .setAuthor(msg.author.username, msg.author.displayAvatarURL())
                .setThumbnail(message.author.displayAvatarURL())
                .setDescription(msg.content)
                .addField('Jump', `[Go to message!](${msg.url})`)
                .setFooter(`#${(msg.channel as GuildChannel).name} quoted by ${message.author.tag}`)
                .setTimestamp(msg.createdTimestamp);
            if (msg.embeds[0] && attachmentLink == null) {
                let title = (msg.embeds[0].title) ? msg.embeds[0].title : 'no title',
                    description = (msg.embeds[0].description) ? msg.embeds[0].description : 'no description';
                embed.addField(`Embed: ${title}`, `Description: ${description}`);
                if (msg.embeds[0].image) embed.setImage(msg.embeds[0].image.url);
            }

            if (!embed.image && (msg.attachments.size > 0 ?? !attachmentLink))
            embed.setImage(msg.attachments.size > 0 ? msg.attachments
                .map((a: MessageAttachment) => a.url)
                .filter((item: string) => item)[0] : attachmentLink![0]);
            
            message.channel.send({ embeds: [embed] });

            content = content.replace(/https?:\/\/(?:canary\.|ptb\.)?discord(?:app)?\.com\/channels\/(?:@me|\d{17,19}\/)?\d{17,20}\/\d{17,20}/, ``);
            args = content.trim().split(' ');

            module.exports.run(client, message, args, ++recursiveCount);
        
        }).catch((err: Error) => console.log(err));
    }).catch(err => console.log(err));
}

interface messageLink {
    groups: {
        guildID: Snowflake, 
        channelID: Snowflake,
        messageID: Snowflake
    }
}