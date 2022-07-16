import { MessageActionRow, MessageButton, type CommandInteraction, MessageEmbed } from 'discord.js';
import type { Message } from 'discord.js';
import { Categories, randomColor } from '#constants/index';
import { type ApplicationCommandRegistry, Command } from '@sapphire/framework';
import { buildCustomId } from '#constants/components';

export default class Credits extends Command {
  public override name = 'credits';
  public override description = 'Lists everyone that has helped with the project of Semblance, including myself(SirH).';
  public override fullCategory = [Categories.semblance];

  public override sharedRun(builder: Command['SharedBuilder']) {
    const user = 'user' in builder ? builder.user : builder.author;
    const embed = new MessageEmbed()
      .setTitle('Credits')
      .setColor(randomColor)
      .addFields(
        { name: 'Developer', value: 'SirH' },
        { name: 'Special Thanks and Organizer', value: 'Aditya' },
        {
          name: 'Artist',
          value: [
            '**Semblance:** cabiie',
            "**Semblance Beta:** Lemon ([Lemon's Instagram page](https://www.instagram.com/creations_without_limtation/))",
            '**Semblance Revisioned:** StarLuckArt(preview soon:tm:) ([DeviantArt](https://www.deviantart.com/starluckart) and [Personal Site](https://bubblestheprotogen.wixsite.com/starluckart))',
          ].join('\n'),
        },
        { name: 'Silly dude who makes up funny ideas', value: 'NerdGamer2848' },
        { name: 'Early Testers', value: 'Aditya, Parrot, Diza, 0NrD, and Aure' },
        {
          name: 'Contributors',
          value: [
            '**Mesozoic Valley and Singularity Speedrun Guide:** Jojoseis',
            '**Image for Prestige List:** Hardik Chavada',
            '**Image for Nanobots:** SampeDrako',
            '**Image for Currency:** Off Pringles',
          ].join('\n'),
        },
      );
    const component = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId(buildCustomId({ command: 'credits', action: 'thanks', id: user.id }))
        .setLabel('Special Thanks')
        .setStyle('PRIMARY'),
      new MessageButton()
        .setCustomId(buildCustomId({ command: 'credits', action: 'semblance', id: user.id }))
        .setLabel('Preview Semblance Art')
        .setStyle('PRIMARY'),
      new MessageButton()
        .setCustomId(buildCustomId({ command: 'credits', action: 'semblance-beta', id: user.id }))
        .setLabel('Preview Semblance Beta Art')
        .setStyle('PRIMARY'),
      new MessageButton()
        .setCustomId(buildCustomId({ command: 'credits', action: 'semblance-revisioned', id: user.id }))
        .setLabel('Preview Semblance Revisioned Art')
        .setStyle('PRIMARY'),
    );

    return { embeds: [embed], components: [component] };
  }

  public override async messageRun(message: Message) {
    await message.reply(this.sharedRun(message));
  }

  public override async chatInputRun(interaction: CommandInteraction<'cached'>) {
    await interaction.reply(this.sharedRun(interaction));
  }

  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand(
      {
        name: this.name,
        description: this.description,
      },
      { idHints: ['973689166791606283'] },
    );
  }
}
