import { Categories, prefix, randomColor } from '#src/constants';
import { InfoBuilder } from '#src/structures/pieces/InfoBuilder';
import { Embed, ActionRow, ButtonComponent, ButtonStyle } from 'discord.js';

export default class Help extends InfoBuilder {
  public override name = 'help';

  public override async build(builder: InfoBuilder['BuildOption']) {
    const user = 'user' in builder ? builder.user : builder.author;
    const c2sServerCommands = builder.client.stores
      .get('commands')
      .filter(c => c.category === Categories.c2sServer)
      .map(c => `**${prefix}${c.name}**`);
    const embed = new Embed()
      .setTitle('Semblance Command List')
      .setColor(randomColor)
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setThumbnail(builder.client.user.displayAvatarURL())
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
            `[here](https://discord.com/oauth2/authorize?client_id=${builder.client.user.id}&permissions=8&scope=bot+applications.commands) to authorize Semblance.`,
          ].join(' '),
        },
      )
      .setFooter({
        text: `Stay Cellular! If you really like the work I've done to Semblance, then check out ${prefix}patreon :D`,
      });
    const components = [
      new ActionRow().addComponents(
        new ButtonComponent()
          .setCustomId(
            JSON.stringify({
              command: 'help',
              action: 'c2shelp',
              id: user.id,
            }),
          )
          .setLabel('Cell to Singularity Help')
          .setStyle(ButtonStyle.Primary),
        new ButtonComponent()
          .setCustomId(
            JSON.stringify({
              command: 'help',
              action: 'calchelp',
              id: user.id,
            }),
          )
          .setLabel('Calculator Help')
          .setStyle(ButtonStyle.Primary),
        new ButtonComponent()
          .setCustomId(
            JSON.stringify({
              command: 'help',
              action: 'mischelp',
              id: user.id,
            }),
          )
          .setLabel('Miscellaneous Help')
          .setStyle(ButtonStyle.Primary),
        // new ButtonComponent()
        //   .setCustomId(
        //     JSON.stringify({
        //       command: 'help',
        //       action: 'bughelp',
        //       id: user.id,
        //     }),
        //   )
        //   .setDisabled(builder.guild.id != c2sGuildId && ![sirhId, adityaId].includes(user.id))
        //   .setLabel('Bug Reporting Help')
        //   .setEmoji({ name: '🐛' })
        //   .setStyle(ButtonStyle.Primary),
        new ButtonComponent()
          .setCustomId(
            JSON.stringify({
              command: 'help',
              action: 'close',
              id: user.id,
            }),
          )
          .setLabel('Close')
          .setEmoji({ name: '🚫' })
          .setStyle(ButtonStyle.Secondary),
      ),
    ];
    return {
      content: 'side note: if your Discord client supports it, you can use: `/help query: INPUT_HERE` instead.',
      embeds: [embed],
      components,
    };
  }
}
