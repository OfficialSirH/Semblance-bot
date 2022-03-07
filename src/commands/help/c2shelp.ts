import { type Message, Embed, ActionRow, ButtonComponent, ButtonStyle } from 'discord.js';
import { Categories, randomColor, Subcategories, subcategoryList } from '#constants/index';
import { Command } from '@sapphire/framework';
import { buildCustomId } from '#src/constants/components';

export default class C2sHelp extends Command {
  public override name = 'c2shelp';
  public override description = 'List of all Cell to Singularity related commands';
  public override fullCategory = [Categories.help];

  public override sharedRun(builder: Command['SharedBuilder']) {
    const client = builder.client;
    const user = 'user' in builder ? builder.user : builder.author;

    const mainCommands = subcategoryList(client, Categories.game, Subcategories.main);
    const mesozoicCommands = subcategoryList(client, Categories.game, Subcategories.mesozoic);
    const otherCommands = subcategoryList(client, Categories.game, Subcategories.other);
    const components = [
      new ActionRow().addComponents(
        new ButtonComponent()
          .setCustomId(
            buildCustomId({
              command: 'help',
              action: 'metabits',
              id: user.id,
            }),
          )
          .setLabel('Metabits Guide')
          .setStyle(ButtonStyle.Primary),
        new ButtonComponent()
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
    const embed = new Embed()
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
