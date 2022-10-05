import {
  ActionRowBuilder,
  ButtonBuilder,
  type ChatInputCommandInteraction,
  EmbedBuilder,
  ApplicationCommandOptionType,
  ButtonStyle,
  type MessageActionRowComponentBuilder,
} from 'discord.js';
import type { sizeType } from '#lib/interfaces/catAndDogAPI';
import { fetchCatOrDog } from '#constants/commands';
import { type ApplicationCommandRegistry, Command } from '@sapphire/framework';
import { buildCustomId } from '#constants/components';

export default class Imagegen extends Command {
  public override name = 'imagegen';
  public override description = 'Generates a random image of either a cat or dog.';

  public override async chatInputRun(interaction: ChatInputCommandInteraction<'cached'>) {
    if (!interaction.options.getSubcommand()) return;
    const wantsCat = interaction.options.getSubcommand() === 'cat';

    const query_params = {
      has_breeds: true,
      mime_types: 'jpg,png,gif',
      size: 'small' as sizeType,
      sub_id: interaction.user.username,
      limit: 1,
    };

    const images = await fetchCatOrDog(query_params, wantsCat);

    if (images.length === 0)
      return interaction.reply({
        content: 'No images found.',
        ephemeral: true,
      });

    const image = images[0],
      image_url = image.url,
      breed = image.breeds[0];

    const embed = new EmbedBuilder()
      .setTitle(`Here's a ${breed.name}!`)
      .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
      .setDescription(`Hi! I'm known to be ${breed.temperament} :D`)
      .setImage(image_url);

    const components = [
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setLabel('Refresh')
          .setEmoji('🔄')
          .setStyle(ButtonStyle.Secondary)
          .setCustomId(
            buildCustomId({
              command: 'imagegen',
              action: `refresh-${wantsCat ? 'cat' : 'dog'}`,
              id: interaction.user.id,
            }),
          ),
      ),
    ];

    return interaction.reply({
      embeds: [embed],
      components,
    });
  }

  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand({
      name: this.name,
      description: this.description,
      options: [
        {
          name: 'cat',
          description: 'Generates a random cat image.',
          type: ApplicationCommandOptionType.Subcommand,
        },
        {
          name: 'dog',
          description: 'Generates a random dog image.',
          type: ApplicationCommandOptionType.Subcommand,
        },
      ],
    });
  }
}
