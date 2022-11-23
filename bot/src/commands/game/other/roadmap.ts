import {
  type ChatInputCommandInteraction,
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  ButtonStyle,
  type MessageActionRowComponentBuilder,
} from 'discord.js';
import { Category, randomColor, Subcategory, attachments } from '#constants/index';
import { type ApplicationCommandRegistry, Command } from '@sapphire/framework';
import { buildCustomId } from '#constants/components';

export default class Roadmap extends Command {
  public override name = 'roadmap';
  public override description = 'details on the C2S Roadmap';
  public override fullCategory = [Category.game, Subcategory.other];

  public async chatInputRun(interaction: ChatInputCommandInteraction<'cached'>) {
    await interaction.reply(this.sharedRun(interaction));
  }

  public override sharedRun(interaction: Command['SharedBuilder']) {
    const embed = new EmbedBuilder()
      .setTitle('Road Map')
      .setColor(randomColor)
      .setThumbnail(attachments.currentLogo.name)
      .setImage(attachments.roadMap.name);
    const components = [
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId(
            buildCustomId({
              command: 'roadmap',
              action: 'testers',
              id: interaction.user.id,
            }),
          )
          .setStyle(ButtonStyle.Primary)
          .setLabel('Early Beyond Testers'),
        new ButtonBuilder()
          .setCustomId(
            buildCustomId({
              command: 'roadmap',
              action: 'early-beyond',
              id: interaction.user.id,
            }),
          )
          .setStyle(ButtonStyle.Primary)
          .setLabel('Early Beyond Sneak Peeks'),
      ),
    ];
    return { embeds: [embed], files: [attachments.currentLogo.attachment, attachments.roadMap.attachment], components };
  }

  public registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand({
      name: this.name,
      description: this.description,
    });
  }
}
