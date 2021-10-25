import type { Message, TextChannel, MessageMentionTypes } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import { attachmentLinkRegex } from '#constants/index';
import type { Command } from '#lib/interfaces/Semblance';

export default {
  description: 'Make announcements through Semblance',
  category: 'admin',
  usage: {
    "<'!ar' for anonymous msg> <channel> <msg>": '',
  },
  permissionRequired: 2,
  checkArgs: args => args.length >= 2,
  run: (_client, message, args, _identifier, { permissionLevel, content }) =>
    run(message, args, { permissionLevel, content }),
} as Command<'admin'>;

const run = async (message: Message, args: string[], { permissionLevel, content }) => {
  message.delete();
  let channel = !message.mentions ? message.channel : (message.mentions.channels.first() as TextChannel);
  if (!message.guild.channels.cache.has(channel.id))
    return message.reply("Don't be using channels from other servers, that's not allowed.");
  args.splice(args.indexOf(`<#${channel.id}>`), 1);
  let announcement = args.join(' ');

  let messageOptions = {
    content: announcement,
    files: [],
    allowedMentions:
      permissionLevel >= 4
        ? { parse: ['users', 'roles', 'everyone'] as MessageMentionTypes[] }
        : { parse: ['users'] as MessageMentionTypes[] },
  };
  if (message.attachments.size > 0) messageOptions.files.push(message.attachments.map(a => a)[0]);
  else if (!!attachmentLinkRegex.exec(content)) messageOptions.files.push(attachmentLinkRegex.exec(content)[0]);

  if (args[args.length - 1] == 'embed')
    return sendEmbedAnnouncement(channel as TextChannel, message, announcement, !announcement.startsWith('!ar'));

  if (!announcement.startsWith('!ar') ?? permissionLevel < 7) {
    announcement += `\n- ${message.author.tag}(${message.author.id})`;
    announcement = announcement.replace(/!ar/, '');
  }
  if (announcement.length > 2000) return message.reply('Your input was too long');
  channel.send(messageOptions).catch(() =>
    message.reply("Something went wrong with the message, you might've typed too many characters.").then(msg =>
      setTimeout(() => {
        if (!msg.deleted) msg.delete();
      }, 5000),
    ),
  );
};

async function sendEmbedAnnouncement(channel: TextChannel, message: Message, announcement: string, identity: boolean) {
  announcement = announcement.substring(0, announcement.lastIndexOf('embed'));

  let embed = new MessageEmbed().setDescription(announcement);

  if (message.attachments.size > 0) embed.setImage(message.attachments.map(a => a.url)[0]);
  else if (!!attachmentLinkRegex.exec(announcement)) embed.setImage(attachmentLinkRegex.exec(announcement)[0]);

  if (identity) embed.setAuthor(message.author.tag, message.author.displayAvatarURL());

  channel.send({ embeds: [embed] }).catch(() =>
    message.reply("Something went wrong with the message, you might've typed too many characters.").then(msg =>
      setTimeout(() => {
        if (!msg.deleted) msg.delete();
      }, 5000),
    ),
  );
}
