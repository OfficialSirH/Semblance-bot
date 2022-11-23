import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  type MessageActionRowComponentBuilder,
} from 'discord.js';
import { Category, randomColor, Subcategory, subcategoryList } from '#constants/index';
import { Command } from '@sapphire/framework';
import { buildCustomId } from '#constants/components';

export default class C2sHelp extends Command {
  public override name = 'c2shelp';
  public override description = 'List of all Cell to Singularity related commands';
  public override fullCategory = [Category.help];

  public override sharedRun(interaction: Command['SharedBuilder']) {
    const { client, user } = interaction;

    const mainCommands = subcategoryList(client, Category.game, Subcategory.main);
    const mesozoicCommands = subcategoryList(client, Category.game, Subcategory.mesozoic);
    const otherCommands = subcategoryList(client, Category.game, Subcategory.other);
    const components = [
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId(
            buildCustomId({
              command: 'help',
              action: 'metabits',
              id: user.id,
            }),
          )
          .setLabel('Metabits Guide')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId(
            buildCustomId({
              command: 'help',
              action: 'mesoguide',
              id: user.id,
            }),
          )
          .setLabel('Mesozoic Valley Guide')
          .setStyle(ButtonStyle.Primary),
      ),
    ];
    const embed = new EmbedBuilder()
      .setTitle('**-> Cell to Singularity Commands**')
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setColor(randomColor)
      .setThumbnail(client.user.displayAvatarURL())
      .addFields(
        { name: 'Main Simulation', value: mainCommands, inline: true },
        { name: 'Mesozoic Valley', value: mesozoicCommands, inline: true },
        { name: '\u200b', value: '\u200b' },
        { name: 'Other/Extras', value: otherCommands, inline: true },
      )
      .setFooter({ text: 'C2S for the win!' });
    return { embeds: [embed], components };
  }
}
