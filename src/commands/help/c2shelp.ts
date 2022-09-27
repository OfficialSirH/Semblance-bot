import { type Message, MessageEmbed, MessageActionRow, MessageButton } from 'discord.js';
import { Category, randomColor, Subcategory, subcategoryList } from '#constants/index';
import { Command } from '@sapphire/framework';
import { buildCustomId } from '#constants/components';

export default class C2sHelp extends Command {
  public override name = 'c2shelp';
  public override description = 'List of all Cell to Singularity related commands';
  public override fullCategory = [Category.help];

  public override sharedRun(builder: Command['SharedBuilder']) {
    const client = builder.client;
    const user = 'user' in builder ? builder.user : builder.author;

    const mainCommands = subcategoryList(client, Category.game, Subcategory.main);
    const mesozoicCommands = subcategoryList(client, Category.game, Subcategory.mesozoic);
    const otherCommands = subcategoryList(client, Category.game, Subcategory.other);
    const components = [
      new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId(
            buildCustomId({
              command: 'help',
              action: 'metabits',
              id: user.id,
            }),
          )
          .setLabel('Metabits Guide')
          .setStyle('PRIMARY'),
        new MessageButton()
          .setCustomId(
            buildCustomId({
              command: 'help',
              action: 'mesoguide',
              id: user.id,
            }),
          )
          .setLabel('Mesozoic Valley Guide')
          .setStyle('PRIMARY'),
      ),
    ];
    const embed = new MessageEmbed()
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

  public override async messageRun(message: Message) {
    await message.reply(this.sharedRun(message));
  }
}
