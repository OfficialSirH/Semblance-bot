import { Embed } from 'discord.js';
import { randomColor } from '#constants/index';
import type { Message } from 'discord.js';
import type { SapphireClient } from '@sapphire/framework';
import { Command } from '@sapphire/framework';

export default {
  description: 'get invite for bot, SirH server, or C2S server',
  category: 'semblance',
  permissionRequired: 0,
  checkArgs: () => true,
  run: (client, message) => run(client, message),
} as Command<'semblance'>;

const run = (client: SapphireClient, message: Message) => {
  const embed = new Embed()
    .setTitle('Bot Invite')
    .setColor(randomColor)
    .setThumbnail(client.user.displayAvatarURL())
    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
    .setDescription(
      `Invite me to your server be clicking [here](https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot+applications.commands).` +
        '\n\n[Semblance Support server](https://discord.gg/XFMaTn6taf)',
    )
    .setFooter({ text: 'Spread the word about Semblance!' });
  message.author.send({ embeds: [embed] }).catch(() => message.reply("I can't DM you!"));
};
