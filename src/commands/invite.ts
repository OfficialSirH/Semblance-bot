import { MessageEmbed } from 'discord.js';
import { randomColor } from '#constants/index';
import type { Message } from 'discord.js';
import type { Semblance } from '#structures/Semblance';
import type { Command } from '#lib/interfaces/Semblance';

export default {
  description: 'get invite for bot, SirH server, or C2S server',
  category: 'semblance',
  permissionRequired: 0,
  checkArgs: () => true,
  run: (client, message) => run(client, message),
} as Command<'semblance'>;

const run = (client: Semblance, message: Message) => {
  let embed = new MessageEmbed()
    .setTitle('Bot Invite')
    .setColor(randomColor)
    .setThumbnail(client.user.displayAvatarURL())
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setDescription(
      `Invite me to your server be clicking [here](https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot+applications.commands).` +
        `\n\n[Semblance Support server](https://discord.gg/XFMaTn6taf)`,
    )
    .setFooter(`Spread the word about Semblance!`);
  message.author.send({ embeds: [embed] }).catch(() => message.reply("I can't DM you!"));
};
