import { ApplicationCommandOptionType, ChatInputCommandInteraction, TextChannel } from 'discord.js';
import { Embed, MessageAttachment } from 'discord.js';
import { bugChannels } from '#constants/commands';
import { c2sGuildId, sirhGuildId } from '#config';
import { emojis } from '#constants/index';
import { type ApplicationCommandRegistry, Command } from '@sapphire/framework';

export default class Bugreport extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'bugreport',
      description: 'Report a Cell to Singularity bug',
    });
  }

  // TODO: later replace this with a modal interaction instead
  public override async chatInputRun(interaction: ChatInputCommandInteraction<'cached'>) {
    const action = interaction.options.getSubcommand(true);
    switch (action) {
      case 'report':
        return report(interaction);
      case 'attach':
        return attach(interaction);
      case 'reproduce':
        return reproduce(interaction);
      case 'list':
        return list(interaction);
      case 'accept':
        return accept(interaction);
      case 'deny':
        return deny(interaction);
      default:
        return interaction.reply({
          content: 'You must specify a valid subcommand.',
          ephemeral: true,
        });
    }
  }

  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand(
      {
        name: this.name,
        description: this.description,
        options: [
          {
            name: 'report',
            description: 'Report a bug',
            type: ApplicationCommandOptionType.Subcommand,
          },
          {
            name: 'attach',
            description: 'Attach a file to the bug report',
            type: ApplicationCommandOptionType.Subcommand,
          },
          {
            name: 'reproduce',
            description: "Add to someone's bug report that you can reproduce it",
            type: ApplicationCommandOptionType.Subcommand,
          },
          {
            name: 'list',
            description: 'List all of your bug reports',
            type: ApplicationCommandOptionType.Subcommand,
          },
          {
            name: 'accept',
            description: 'Accept a bug report',
            type: ApplicationCommandOptionType.Subcommand,
          },
          {
            name: 'deny',
            description: 'Deny a bug report',
            type: ApplicationCommandOptionType.Subcommand,
          },
        ],
      },
      {
        guildIds: [c2sGuildId],
      },
    );
  }
}

async function report(interaction: ChatInputCommandInteraction): Promise<void> {
  const { user } = interaction;
  const title = interaction.options.getString('title', true),
    result = interaction.options.getString('result', true),
    expected = interaction.options.getString('expected', true),
    os = interaction.options.getString('os', true),
    version = interaction.options.getString('version', true);

  const reportCount = (await interaction.client.db.report.findMany({})).length,
    newBugId = reportCount + 1;

  const message = await (interaction.guild.channels.cache.get(bugChannels.queue) as TextChannel).send({
    embeds: [
      new Embed()
        .setAuthor({
          name: `${user.tag} (${user.id})\nBug Id: #${newBugId}`,
          iconURL: user.displayAvatarURL(),
        })
        .setColor(0x9512e8)
        .setTitle(title)
        .addFields(
          { name: 'Result', value: result },
          { name: 'Expected Result', value: expected },
          { name: 'Operating System', value: os },
          { name: 'Game Version', value: version },
        )
        .setFooter({ text: `Bug ID: #${newBugId}` })
        .setTimestamp(Date.now()),
    ],
  });

  await interaction.client.db.report.create({
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
        .setAuthor({ name: `${user.tag} (${user.id})`, iconURL: user.displayAvatarURL() })
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

async function attach(interaction: ChatInputCommandInteraction): Promise<void> {
  const bugId = interaction.options.getNumber('bugid'),
    link = interaction.options.getString('link'),
    report = await interaction.client.db.report.findUnique({ where: { bugId } });

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
    embed.addFields(...newFields);
  }

  message.edit({ embeds: [embed] });
}

async function reproduce(interaction: ChatInputCommandInteraction<'cached'>): Promise<void> {
  const { user } = interaction,
    bugId = interaction.options.getNumber('bugid'),
    os = interaction.options.getString('os'),
    version = interaction.options.getString('version'),
    report = await interaction.client.db.report.findUnique({ where: { bugId } });

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
    embed.addFields({ name: 'Can Reproduce', value: `${user.tag} | ${os} | ${version}` });
  }
}

async function list(interaction: ChatInputCommandInteraction<'cached'>): Promise<void> {
  const { user } = interaction;

  const reports = (await interaction.client.db.report.findMany({ where: { userId: user.id } })).reverse().slice(0, 10);

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

async function accept(interaction: ChatInputCommandInteraction<'cached'>): Promise<void> {
  const bugId = interaction.options.getNumber('bugid'),
    report = await interaction.client.db.report.findUnique({ where: { bugId } });

  if (!report) return interaction.reply({ content: 'Invalid bug ID.', ephemeral: true });

  const queueChannel = interaction.guild.channels.cache.get(bugChannels.queue) as TextChannel,
    approvedChannel = interaction.guild.channels.cache.get(bugChannels.approved) as TextChannel;

  const reportMessage = await queueChannel.messages.fetch(report.messageId),
    message = await approvedChannel.send({
      embeds: [reportMessage.embeds[0].setColor(0x17db4a)],
    });

  await interaction.client.db.report.update({
    where: { bugId },
    data: { channelId: approvedChannel.id, messageId: message.id },
  });

  return interaction.reply({
    content: `Bug ${bugId} has been successfully approved.`,
    embeds: [new Embed().setTitle('Bug Approved').setDescription(`[${bugId}](${message.url})`).setColor(0x17db4a)],
    ephemeral: true,
  });
}

async function deny(interaction: ChatInputCommandInteraction): Promise<void> {
  const bugId = interaction.options.getNumber('bugid'),
    reason = interaction.options.getString('reason'),
    report = await interaction.client.db.report.findUnique({ where: { bugId } });

  if (!report) return interaction.reply({ content: 'Invalid bug ID.', ephemeral: true });

  const queueChannel = interaction.guild.channels.cache.get(bugChannels.queue) as TextChannel,
    reportMessage = await queueChannel.messages.fetch(report.messageId),
    user = await interaction.guild.members.fetch(report.userId);

  user
    .send({
      content: 'Your report was denied.',
      embeds: [reportMessage.embeds[0].setColor(0xd72020).addField({ name: 'Denial Message', value: reason })],
    })
    .catch(() => {
      (interaction.guild.channels.cache.find(c => c.name == 'mod-alerts') as TextChannel).send({
        content: `${user.user.tag}'s report was denied but couldn't receive the DM.`,
        embeds: [reportMessage.embeds[0].setColor(0xd72020).addField({ name: 'Denial Message', value: reason })],
      });
    });

  await interaction.client.db.report.delete({ where: { bugId } });

  await reportMessage.delete();

  return interaction.reply({
    content: `Bug ${bugId} has been successfully denied.`,
    ephemeral: true,
  });
}
