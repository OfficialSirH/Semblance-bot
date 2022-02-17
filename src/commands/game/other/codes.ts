import { ActionRow, ButtonComponent, ButtonStyle, Embed } from 'discord.js';
import type { Message } from 'discord.js';
import { randomColor } from '#constants/index';
import { currentLogo } from '#config';
import { Command } from '@sapphire/framework';
import type { SapphireClient } from '@sapphire/framework';

export default {
  description: 'get all of the ingame codes',
  category: 'game',
  subcategory: 'other',
  permissionRequired: 0,
  checkArgs: () => true,
  run: (client, message) => run(client, message),
} as Command<'game'>;

const run = async (client: SapphireClient, message: Message) => {
  const codeHandler = await client.db.information.findUnique({ where: { type: 'codes' } });
  const embed = new Embed()
    .setTitle('Darwinium Codes')
    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
    .setColor(randomColor)
    .setThumbnail(currentLogo.name)
    .setDescription(codeHandler.value)
    .setFooter({ text: codeHandler.footer });
  const component = new ActionRow().addComponents(
    new ButtonComponent()
      .setCustomId(
        JSON.stringify({
          command: 'codes',
          action: 'expired',
          id: message.author.id,
        }),
      )
      .setLabel('View Expired Codes')
      .setStyle(ButtonStyle.Primary),
  );
  message.channel.send({
    embeds: [embed],
    files: [currentLogo],
    components: [component],
  });
};
