/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { MessageEmbed, MessageAttachment } from 'discord.js';
import type { TextChannel, GuildChannel, Message, Snowflake } from 'discord.js';
import { messageLinkRegex, attachmentLinkRegex } from '#constants/index';
import { Jump } from '#models/Jump';
import type { Semblance } from '#structures/Semblance';
import type { Command } from '#lib/interfaces/Semblance';

export default {
  description: 'Converts message links to an embed',
  category: 'auto',
  permissionRequired: 0,
  checkArgs: () => true,
  run: (client, message, args) => run(client, message, args),
} as Command<'auto'>;

/**
 * @deprecated remove automatic actions in favor of full rewrite to only interactions
 * @param client discord.js client
 * @param message discord.js message object
 * @param args message arguments
 * @param recursiveCount the amount of loops of the recursive function
 */
const run = async (client: Semblance, message: Message, args: string[], recursiveCount = 0) => {
  if (recursiveCount == 2) return message.delete();
  if (recursiveCount == 0 && !(await Jump.findOne({ userId: message.author.id }))?.active) return;

  let content = args.join(' ');

  const link = messageLinkRegex.exec(content);
  if (link == null) return recursiveCount > 0 ? message.delete() : undefined;
  const {
    groups: { guildId, channelId, messageId },
  } = link as unknown as messageLink;

  client.guilds
    .fetch(guildId)
    .then(guild => {
      const channel = guild.channels.cache.get(channelId);
      if ((channel as TextChannel)!.nsfw ?? guild.id != message!.guild!.id) return;

      if (recursiveCount == 0)
        message.content.replace(messageLinkRegex, '').length == 0
          ? undefined
          : message.channel.send(message.content.replace(messageLinkRegex, ''));

      (channel as TextChannel)!.messages
        .fetch(messageId)
        .then(async msg => {
          const attachmentLink = attachmentLinkRegex.exec(msg.content);
          if (attachmentLink != null) msg.content = msg.content.replace(attachmentLink[0], '');

          const embed = new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL())
            .setThumbnail(message.author.displayAvatarURL())
            .setDescription(msg.content)
            .addField('Jump', `[Go to message!](${msg.url})`)
            .setFooter(`#${(msg.channel as GuildChannel).name} quoted by ${message.author.tag}`)
            .setTimestamp(msg.createdTimestamp);
          if (msg.embeds[0] && attachmentLink == null) {
            const title = msg.embeds[0].title ? msg.embeds[0].title : 'no title';
            embed.addField(`*Contains embed titled: ${title}*`, '\u200b');
            if (msg.embeds[0].image) embed.setImage(msg.embeds[0].image.url);
          }

          if (!embed.image && (msg.attachments.size > 0 ?? !attachmentLink))
            embed.setImage(
              msg.attachments.size > 0
                ? msg.attachments.map((a: MessageAttachment) => a.url).filter((item: string) => item)[0]
                : attachmentLink![0],
            );

          message.channel.send({ embeds: [embed] });

          content = content.replace(
            /https?:\/\/(?:canary\.|ptb\.)?discord(?:app)?\.com\/channels\/(?:@me|\d{17,19}\/)?\d{17,20}\/\d{17,20}/,
            '',
          );
          args = content.trim().split(' ');

          run(client, message, args, ++recursiveCount);
        })
        .catch((err: Error) => console.log(err));
    })
    .catch(err => console.log(err));
};

interface messageLink {
  groups: {
    guildId: Snowflake;
    channelId: Snowflake;
    messageId: Snowflake;
  };
}
