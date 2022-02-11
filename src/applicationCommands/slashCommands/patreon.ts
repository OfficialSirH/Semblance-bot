import { ActionRow, ButtonComponent } from 'discord.js';
import type { SlashCommand } from '#lib/interfaces/Semblance';

export default {
  permissionRequired: 0,
  run: interaction => {
    const component = new ActionRow().addComponents(
      new ButtonComponent()
        .setStyle('LINK')
        .setLabel('CLICK ME!')
        .setEmoji('<:SirUwU:797148051000000512>')
        .setURL('https://www.patreon.com/SirHDeveloper'),
    );
    return interaction.reply({
      content: 'Support me on [Patreon](https://www.patreon.com/SirHDeveloper)!',
      ephemeral: true,
      components: [component],
    });
  },
} as SlashCommand;
