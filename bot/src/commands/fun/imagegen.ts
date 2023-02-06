import type { sizeType } from '#lib/interfaces/catAndDogAPI';
import { fetchCatOrDog } from '#constants/commands';
import { Command } from '#structures/Command';
import { buildCustomId } from '#constants/components';
import { Category, authorDefault } from '#constants/index';
import {
  ButtonStyle,
  ApplicationCommandOptionType,
  type APIChatInputApplicationCommandGuildInteraction,
  MessageFlags,
  type RESTPostAPIApplicationCommandsJSONBody,
  type APIMessageComponentButtonInteraction,
} from '@discordjs/core';
import type { FastifyReply } from 'fastify';
import {
  EmbedBuilder,
  ActionRowBuilder,
  type MessageActionRowComponentBuilder,
  ButtonBuilder,
} from '@discordjs/builders';
import type { InteractionOptionResolver } from '#structures/InteractionOptionResolver';
import type { ParsedCustomIdData } from '#lib/interfaces/Semblance';

export default class Imagegen extends Command {
  public constructor(client: Command.Requirement) {
    super(client, {
      name: 'imagegen',
      description: 'Generates a random image of either a cat or dog.',
      fullCategory: [Category.fun],
    });
  }

  public override async chatInputRun(
    res: FastifyReply,
    interaction: APIChatInputApplicationCommandGuildInteraction,
    options: InteractionOptionResolver,
  ) {
    if (!options.getSubcommand()) return;
    const wantsCat = options.getSubcommand() === 'cat';

    const query_params = {
      has_breeds: true,
      mime_types: 'jpg,png,gif',
      size: 'small' as sizeType,
      sub_id: interaction.member.user.username,
      limit: 1,
    };

    const images = await fetchCatOrDog(query_params, wantsCat);

    if (images.length === 0)
      return this.client.api.interactions.reply(res, {
        content: 'No images found.',
        flags: MessageFlags.Ephemeral,
      });

    const image = images[0],
      image_url = image.url,
      breed = image.breeds[0];

    const embed = new EmbedBuilder()
      .setTitle(`Here's a ${breed.name}!`)
      .setAuthor(authorDefault(interaction.member.user))
      .setDescription(`Hi! I'm known to be ${breed.temperament} :D`)
      .setImage(image_url);

    const components = [
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setLabel('Refresh')
          .setEmoji({ name: '🔄' })
          .setStyle(ButtonStyle.Secondary)
          .setCustomId(
            buildCustomId({
              command: 'imagegen',
              action: `refresh-${wantsCat ? 'cat' : 'dog'}`,
              id: interaction.member.user.id,
            }),
          ),
      ),
    ].map(row => row.toJSON());

    return this.client.api.interactions.reply(res, {
      embeds: [embed.toJSON()],
      components,
    });
  }

  public override data() {
    return {
      command: {
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
      } satisfies RESTPostAPIApplicationCommandsJSONBody,
    };
  }

  public override async componentRun(
    interaction: APIMessageComponentButtonInteraction,
    data: ParsedCustomIdData<'refresh-cat' | 'refresh-dog'>,
  ) {
    const wantsCat = data.action === 'refresh-cat',
      query_params = {
        has_breeds: true,
        mime_types: 'jpg,png,gif',
        size: 'small' as sizeType,
        sub_id: interaction.user.username,
        limit: 1,
      };

    const images = await fetchCatOrDog(query_params, wantsCat);

    if (images.length === 0)
      return this.client.api.interactions.reply(res, { content: 'No images found.', flags: MessageFlags.Ephemeral });

    const image = images[0],
      image_url = image.url,
      breed = image.breeds[0];

    const embed = new EmbedBuilder()
      .setTitle(`Here's a ${breed.name}!`)

      .setDescription(`Hi! I'm known to be ${breed.temperament} :D`)
      .setImage(image_url);

    await this.client.api.interactions.updateMessage(reply, { embeds: [embed.toJSON()] });
  }
}
