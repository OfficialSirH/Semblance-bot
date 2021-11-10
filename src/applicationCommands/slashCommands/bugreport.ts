import type { SlashCommand } from '#lib/interfaces/Semblance';
import { Report } from '#models/Report';
import type { CommandInteraction, TextChannel } from 'discord.js';
import { MessageEmbed, MessageAttachment } from 'discord.js';
import { bugChannels } from '#constants/commands';
import { sirhGuildId } from '#config';

export default {
  permissionRequired: 0,
  run: async interaction => {
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
        return report(interaction);
      case 'attach':
        return attach(interaction);
      case 'reproduce':
        return reproduce(interaction);
      default:
        return interaction.reply({
          content: 'You must specify a valid subcommand.',
          ephemeral: true,
        });
    }
  },
} as SlashCommand;

async function report(interaction: CommandInteraction): Promise<void> {
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

  const reportCount = (await Report.find({})).length,
    newBugId = reportCount + 1;

  const message = await (
    interaction.guild.channels.cache.find(c => c.name == 'bug-approval-queue') as TextChannel
  ).send({
    embeds: [
      new MessageEmbed()
        .setAuthor(`${user.tag} (${user.id})\nBug Id: #${newBugId}`, user.displayAvatarURL({ dynamic: true }))
        .setColor('#9512E8')
        .setTitle(title)
        .addFields([
          { name: 'Result', value: result },
          { name: 'Expected Result', value: expected },
          { name: 'Operating System', value: os },
          { name: 'Game Version', value: version },
          {
            name: 'Can Reproduce',
            value: 'Currently no one else has reproduced this bug.',
          },
        ])
        .setFooter(`Bug ID: #${newBugId}`)
        .setTimestamp(Date.now()),
    ],
  });

  const report = new Report({
    User: user.id,
    bugId: newBugId,
    messageId: message.id,
    channelId: message.channel.id,
  });
  await report.save();

  interaction.reply({
    embeds: [
      new MessageEmbed()
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
        .setFooter('The ComputerLunch team appreciate your help with our game, Thank you.'),
    ],
  });
}

async function attach(interaction: CommandInteraction): Promise<void> {
  const bugId = interaction.options.getNumber('bugid'),
    link = interaction.options.getString('link');

  if (!(await checkIdValidity(bugId))) return interaction.reply({ content: 'Invalid bug ID.', ephemeral: true });

  const report = await Report.findOne({ bugId });

  const message = await (
    interaction.guild.channels.cache.find(c => c.id == report.channelId) as TextChannel
  ).messages.fetch(report.messageId);

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

async function reproduce(interaction: CommandInteraction): Promise<void> {
  const { user } = interaction;
  const bugId = interaction.options.getNumber('bugid'),
    os = interaction.options.getString('os'),
    version = interaction.options.getString('version');

  if (!(await checkIdValidity(bugId))) return interaction.reply({ content: 'Invalid bug ID.', ephemeral: true });

  const report = await Report.findOne({ bugId });

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

async function checkIdValidity(id: number): Promise<boolean> {
  return !!(await Report.findOne({ bugId: id }));
}
