import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import type { Message } from 'discord.js';
import config from '#config';
import { prefix, randomColor } from '#constants/index';
import type { Semblance } from '#structures/Semblance';
import type { Command } from '#lib/interfaces/Semblance';
const { sirhId, adityaId, c2sGuildId } = config;

export default {
  description: 'Lists *all* available commands.',
  category: 'help',
  permissionRequired: 0,
  checkArgs: () => true,
  run: (client, message) => run(client, message),
} as Command<'help'>;

const run = async (client: Semblance, message: Message) => {
  const c2sServerCommands = Object.keys(client.commands)
    .filter(key => client.commands[key].category == 'c2sServer')
    .map(key => `**${prefix(client)} ${key}**`);
  const embed = new MessageEmbed()
    .setTitle('Semblance Command List')
    .setColor(randomColor)
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setThumbnail(client.user.displayAvatarURL())
    .addFields(
      {
        name: '**-> Cell to Singularity Server Commands**',
        value: c2sServerCommands.join(', '),
        inline: true,
      },
      {
        name: '**-> Slash Commands**',
        value: [
          "Semblance's Slash Commands can be listed by typing `/`, which if none are visible,",
          "that's likely due to Semblance not being authorized on the server and a admin will need to click",
          `[here](https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot+applications.commands) to authorize Semblance.`,
        ].join(' '),
      },
    )
    .setFooter(
      `Stay Cellular! If you really like the work I've done to Semblance, then check out ${prefix(client)} patreon :D`,
    );
  const components = [
    new MessageActionRow().addComponents([
      new MessageButton()
        .setCustomId(
          JSON.stringify({
            command: 'help',
            action: 'c2shelp',
            id: message.author.id,
          }),
        )
        .setLabel('Cell to Singularity Help')
        .setStyle('PRIMARY'),
      new MessageButton()
        .setCustomId(
          JSON.stringify({
            command: 'help',
            action: 'calculator',
            id: message.author.id,
          }),
        )
        .setLabel('Calculator Help')
        .setStyle('PRIMARY'),
      new MessageButton()
        .setCustomId(
          JSON.stringify({
            command: 'help',
            action: 'mischelp',
            id: message.author.id,
          }),
        )
        .setLabel('Miscellaneous Help')
        .setStyle('PRIMARY'),
      new MessageButton()
        .setCustomId(
          JSON.stringify({
            command: 'help',
            action: 'bug',
            id: message.author.id,
          }),
        )
        .setDisabled(Boolean(message.guild.id != c2sGuildId && ![sirhId, adityaId].includes(message.author.id)))
        .setLabel('Bug Reporting Help')
        .setEmoji('🐛')
        .setStyle('PRIMARY'),
      new MessageButton()
        .setCustomId(
          JSON.stringify({
            command: 'help',
            action: 'close',
            id: message.author.id,
          }),
        )
        .setLabel('Close')
        .setEmoji('🚫')
        .setStyle('SECONDARY'),
    ]),
  ];
  message.reply({
    content:
      'Text-based commands are now deprecated and you should instead use slash commands as commands like this one will be gone in the near future. You can see commands with `/help query: INPUT_HERE`.',
    embeds: [embed],
    components,
  });
};
