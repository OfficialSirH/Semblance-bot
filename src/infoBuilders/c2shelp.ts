import { subcategoryList, randomColor } from '#src/constants';
import { InfoBuilder } from '#src/structures/pieces/InfoBuilder';
import { ActionRow, ButtonComponent, ButtonStyle, Embed } from 'discord.js';
export default class C2shelp extends InfoBuilder {
  public override name = 'c2shelp';

  public override async build(builder: InfoBuilder['BuildOption']) {
    const client = builder.client;
    const user = 'user' in builder ? builder.user : builder.author;

    const mainCommands = subcategoryList(client, 'game', 'main');
    const mesozoicCommands = subcategoryList(client, 'game', 'mesozoic');
    const otherCommands = subcategoryList(client, 'game', 'other');
    const components = [
      new ActionRow().addComponents(
        new ButtonComponent()
          .setCustomId(
            JSON.stringify({
              command: 'help',
              action: 'metabits',
              id: user.id,
            }),
          )
          .setLabel('Metabits Guide')
          .setStyle(ButtonStyle.Primary),
        new ButtonComponent()
          .setCustomId(
            JSON.stringify({
              command: 'help',
              action: 'mesoguide',
              id: user.id,
            }),
          )
          .setLabel('Mesozoic Valley Guide')
          .setStyle(ButtonStyle.Primary),
      ),
    ];
    // components[0].components = [
    //   new ButtonComponent()
    //     .setCustomId(
    //       JSON.stringify({
    //         command: 'help',
    //         action: 'metabits',
    //         id: user.id,
    //       }),
    //     )
    //     .setLabel('Metabits Guide')
    //     .setStyle(ButtonStyle.Primary),
    //   new ButtonComponent()
    //     .setCustomId(
    //       JSON.stringify({
    //         command: 'help',
    //         action: 'mesoguide',
    //         id: user.id,
    //       }),
    //     )
    //     .setLabel('Mesozoic Valley Guide')
    //     .setStyle(ButtonStyle.Primary),
    //   ...components[0].components,
    // ];
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
}
