import type { sizeType } from '#lib/interfaces/catAndDogAPI';
import { fetchCatOrDog } from '#constants/commands';
import { componentInteractionDefaultParser } from '#constants/components';

import type { ParsedCustomIdData } from '#lib/interfaces/Semblance';

export default class ImageGen extends InteractionHandler {
  public constructor(context: PieceContext, options: InteractionHandler.Options) {
    super(context, {
      ...options,
      name: 'imagegen',
      interactionHandlerType: InteractionHandlerTypes.Button,
    });
  }

  public override parse(interaction: ButtonInteraction): ReturnType<typeof componentInteractionDefaultParser> {
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

    if (images.length === 0)
      return this.client.api.interactions.reply(res, { content: 'No images found.', flags: MessageFlags.Ephemeral });

    const image = images[0],
      image_url = image.url,
      breed = image.breeds[0];

    const embed = new EmbedBuilder()
      .setTitle(`Here's a ${breed.name}!`)

      .setDescription(`Hi! I'm known to be ${breed.temperament} :D`)
      .setImage(image_url);

    await interaction.update({ embeds: [embed.toJSON()] });
  }
}
