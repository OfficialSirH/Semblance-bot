import type { SlashCommand } from '#lib/interfaces/Semblance';
import type { CommandInteraction, TextChannel } from 'discord.js';
import { Embed, MessageAttachment } from 'discord.js';
import { bugChannels } from '#constants/commands';
import { c2sGuildId, sirhGuildId } from '#config';
import { emojis } from '#constants/index';
import type { SapphireClient } from '@sapphire/framework';

export default {
  permissionRequired: 0,
  run: async (interaction, { client }) => {
    let action: string, commandFailed: boolean;
    try {
      action = interaction.options.getSubcommand(true);
    } catch (e) {
      commandFailed = true;
      interaction.reply({
        content: 'You must specify a subcommand.',
        ephemeral: true,
      });
    }
    if (commandFailed) return;
    switch (action) {
      case 'report':
        return report(client, interaction);
      case 'attach':
        return attach(client, interaction);
      case 'reproduce':
        return reproduce(client, interaction);
      case 'list':
        return list(client, interaction);
      case 'accept':
        return accept(client, interaction);
      case 'deny':
        return deny(client, interaction);
      default:
        return interaction.reply({
          content: 'You must specify a valid subcommand.',
          ephemeral: true,
        });
    }
  },
} as SlashCommand;

async function report(client: SapphireClient, interaction: CommandInteraction): Promise<void> {
  const { user } = interaction;
  const title = interaction.options.getString('title'),
    result = interaction.options.getString('result'),
    expected = interaction.options.getString('expected'),
    os = interaction.options.getString('os'),
    version = interaction.options.getString('version');

  if (!title || !result || !expected || !os || !version)
    return interaction.reply({
      content: 'some data is missing from the provided options, please try again.',
      ephemeral: true,
    });

  const reportCount = (await client.db.report.findMany({})).length,
    newBugId = reportCount + 1;

  const message = await (interaction.guild.channels.cache.get(bugChannels.queue) as TextChannel).send({
    embeds: [
      new Embed()
        .setAuthor(`${user.tag} (${user.id})\nBug Id: #${newBugId}`, user.displayAvatarURL({ dynamic: true }))
        .setColor('#9512E8')
        .setTitle(title)
        .addFields([
          { name: 'Result', value: result },
          { name: 'Expected Result', value: expected },
          { name: 'Operating System', value: os },
          { name: 'Game Version', value: version },
        ])
        .setFooter({ text: `Bug ID: #${newBugId}` })
        .setTimestamp(Date.now()),
    ],
  });

  await client.db.report.create({
    data: {
      userId: user.id,
      messageId: message.id,
      channelId: message.channel.id,
    },
  });

  interaction.reply({
    embeds: [
      new Embed()
        .setTitle('Report Successfully sent!')
        .setURL(message.url)
        .setAuthor(`${user.tag} (${user.id})`, user.displayAvatarURL({ dynamic: true }))
        .setDescription(
          [
            'Your bug report has been sent to the bug approval queue.',
            `Your report's id: ${newBugId}`,
            'You can add attachments to your report with `/bugreport attach` to help the devs see what exactly needs to be looked at.',
          ].join('\n'),
        )
        .setFooter({ text: 'The ComputerLunch team appreciate your help with our game, Thank you.' }),
    ],
    ephemeral: true,
  });
}

async function attach(client: SapphireClient, interaction: CommandInteraction): Promise<void> {
  const bugId = interaction.options.getNumber('bugid'),
    link = interaction.options.getString('link'),
    report = await client.db.report.findUnique({ where: { bugId } });

  if (!report) return interaction.reply({ content: 'Invalid bug ID.', ephemeral: true });

  const message = await (interaction.guild.channels.cache.get(report.channelId) as TextChannel).messages.fetch(
    report.messageId,
  );

  // if the link is not a valid url, return a response of invalid url
  if (!link.match(/^https?:\/\/[^ "]+$/)) return interaction.reply({ content: 'Invalid link.', ephemeral: true });

  // check if link is a file type or not
  const fileType = link.split('.').pop();
  let attachment: string | MessageAttachment, attachmentLink: MessageAttachment | string;
  if (['jpg', 'png', 'gif', 'jpeg', 'tif', 'tiff', 'mkv', 'mp4', 'mov', 'webm'].includes(fileType)) {
    attachment = new MessageAttachment(link);
    attachmentLink = (
      await (
        interaction.client.guilds.cache.get(sirhGuildId).channels.cache.get(bugChannels.imageStorage) as TextChannel
      ).send({
        files: [attachment],
      })
    ).attachments.first();
  } else attachmentLink = link;

  const embed = message.embeds[0];
  // if Attachments exist, add a new line to the value
  if (embed.fields.find(f => f.name == 'Attachments')) {
    // if there are already 5 attachments, return a reply saying that the bug has reached its limit
    if (embed.fields.find(f => f.name == 'Attachments').value.split('\n').length >= 5)
      return interaction.reply({
        content: 'This bug has reached the maximum capacity of attachments.',
        ephemeral: true,
      });
    embed.fields.find(f => f.name == 'Attachments').value += `\n${
      attachmentLink instanceof MessageAttachment
        ? `[${attachmentLink.name}]${attachmentLink.url}`
        : `[other-type link](${attachmentLink})`
    }`;
    // if there are no attachments, add a new field with the attachment
  } else {
    const newFields = [
      {
        name: 'Attachments',
        value: `${
          attachmentLink instanceof MessageAttachment
            ? `[${attachmentLink.name}]${attachmentLink.url}`
            : `[other-type link](${attachmentLink})`
        }`,
      },
    ];
    if (embed.fields.map(f => f.name).includes('Can Reproduce')) {
      newFields.push(
        embed.fields.splice(
          embed.fields.findIndex(f => f.name == 'Can Reproduce'),
          1,
        )[0],
      );
    }
    embed.addFields(newFields);
  }

  message.edit({ embeds: [embed] });
}

async function reproduce(client: SapphireClient, interaction: CommandInteraction): Promise<void> {
  const { user } = interaction,
    bugId = interaction.options.getNumber('bugid'),
    os = interaction.options.getString('os'),
    version = interaction.options.getString('version'),
    report = await client.db.report.findUnique({ where: { bugId } });

  if (!report) return interaction.reply({ content: 'Invalid bug ID.', ephemeral: true });

  const message = await (
    interaction.guild.channels.cache.find(c => c.id == report.channelId) as TextChannel
  ).messages.fetch(report.messageId);

  const embed = message.embeds[0];
  // if Can Reproduce exists, add a new line to the value
  if (embed.fields.find(f => f.name == 'Can Reproduce')) {
    // if there are already 5 lines, return with a reply that the bug is already full
    if (embed.fields.find(f => f.name == 'Can Reproduce').value.split('\n').length >= 5)
      return interaction.reply({
        content: 'This bug has reached the maximum capacity of reproduce.',
        ephemeral: true,
      });
    embed.fields.find(f => f.name == 'Can Reproduce').value += `\n${user.tag} | ${os} | ${version}`;
  }
  // if Can Reproduce doesn't exist, add it
  else {
    embed.addFields([{ name: 'Can Reproduce', value: `${user.tag} | ${os} | ${version}` }]);
  }
}

async function list(client: SapphireClient, interaction: CommandInteraction): Promise<void> {
  const { user } = interaction;

  const reports = (await client.db.report.findMany({ where: { userId: user.id } })).reverse().slice(0, 10);

  if (reports.length == 0) return interaction.reply({ content: 'You have not reported any bugs.', ephemeral: true });

  interaction.reply({
    embeds: [
      new Embed()
        .setTitle('Bug Reports')
        .setDescription(
          reports
            .map(
              r =>
                `[${r.bugId}](https://discord.com/channels/${c2sGuildId}/${r.channelId}/${r.messageId}) - ${
                  r.channelId == bugChannels.queue ? emojis.buffer : emojis.tick
                }`,
            )
            .join('\n'),
        ),
    ],
    ephemeral: true,
  });
}

async function accept(client: SapphireClient, interaction: CommandInteraction): Promise<void> {
  const bugId = interaction.options.getNumber('bugid'),
    report = await client.db.report.findUnique({ where: { bugId } });

  if (!report) return interaction.reply({ content: 'Invalid bug ID.', ephemeral: true });

  const queueChannel = interaction.guild.channels.cache.get(bugChannels.queue) as TextChannel,
    approvedChannel = interaction.guild.channels.cache.get(bugChannels.approved) as TextChannel;

  const reportMessage = await queueChannel.messages.fetch(report.messageId),
    message = await approvedChannel.send({
      embeds: [reportMessage.embeds[0].setColor('#17DB4A')],
    });

  await client.db.report.update({ where: { bugId }, data: { channelId: approvedChannel.id, messageId: message.id } });

  return interaction.reply({
    content: `Bug ${bugId} has been successfully approved.`,
    embeds: [new Embed().setTitle('Bug Approved').setDescription(`[${bugId}](${message.url})`).setColor('#17DB4A')],
    ephemeral: true,
  });
}

async function deny(client: SapphireClient, interaction: CommandInteraction): Promise<void> {
  const bugId = interaction.options.getNumber('bugid'),
    reason = interaction.options.getString('reason'),
    report = await client.db.report.findUnique({ where: { bugId } });

  if (!report) return interaction.reply({ content: 'Invalid bug ID.', ephemeral: true });

  const queueChannel = interaction.guild.channels.cache.get(bugChannels.queue) as TextChannel,
    reportMessage = await queueChannel.messages.fetch(report.messageId),
    user = await interaction.guild.members.fetch(report.userId);

  user
    .send({
      content: 'Your report was denied.',
      embeds: [reportMessage.embeds[0].setColor('#D72020').addField('Denial Message', reason)],
    })
    .catch(() => {
      (interaction.guild.channels.cache.find(c => c.name == 'mod-alerts') as TextChannel).send({
        content: `${user.user.tag}'s report was denied but couldn't receive the DM.`,
        embeds: [reportMessage.embeds[0].setColor('#D72020').addField('Denial Message', reason)],
      });
    });

  await client.db.report.delete({ where: { bugId } });

  await reportMessage.delete();

  return interaction.reply({
    content: `Bug ${bugId} has been successfully denied.`,
    ephemeral: true,
  });
}
