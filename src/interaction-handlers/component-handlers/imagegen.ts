import type { sizeType } from '#lib/interfaces/catAndDogAPI';
import { ButtonInteraction, Embed } from 'discord.js';
import { fetchCatOrDog } from '#constants/commands';
import { componentInteractionDefaultParser } from '#src/constants/components';
import { InteractionHandler, type PieceContext, InteractionHandlerTypes } from '@sapphire/framework';
import type { ParsedCustomIdData } from 'Semblance';

export default class ImageGen extends InteractionHandler {
  public constructor(context: PieceContext, options: InteractionHandler.Options) {
    super(context, {
      ...options,
      name: 'imagegen',
      interactionHandlerType: InteractionHandlerTypes.Button,
    });
  }

  public override parse(interaction: ButtonInteraction) {
    return componentInteractionDefaultParser(this, interaction);
  }

  public override async run(interaction: ButtonInteraction, data: ParsedCustomIdData<'refresh-cat' | 'refresh-dog'>) {
    const wantsCat = data.action === 'refresh-cat',
      query_params = {
        has_breeds: true,
        mime_types: 'jpg,png,gif',
        size: 'small' as sizeType,
        sub_id: interaction.user.username,
        limit: 1,
      };

    const images = await fetchCatOrDog(query_params, wantsCat);

    if (images.length === 0) return interaction.reply({ content: 'No images found.', ephemeral: true });

    const image = images[0],
      image_url = image.url,
      breed = image.breeds[0];

    const embed = new Embed()
      .setTitle(`Here's a ${breed.name}!`)
      .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
      .setDescription(`Hi! I'm known to be ${breed.temperament} :D`)
      .setImage(image_url);

    await interaction.update({ embeds: [embed] });
  }
}
