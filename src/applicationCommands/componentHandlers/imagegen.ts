import type { sizeType } from "@semblance/lib/interfaces/catAndDogAPI";
import type { ButtonData } from "@semblance/lib/interfaces/Semblance";
import type { MessageComponentInteraction } from "discord.js";
import { MessageEmbed } from "discord.js";
import { fetchCatOrDog } from "../../constants/commands";


export const run = async (interaction: MessageComponentInteraction, { action, id}: ButtonData) => {
    const wantsCat = action === "refresh-cat",
    query_params = {
        'has_breeds': true,
        'mime_types': 'jpg,png,gif',
        size: 'small' as sizeType,
        'sub_id': interaction.user.username,
        limit: 1
    };

    const images = await fetchCatOrDog(query_params, wantsCat);

    if (images.length === 0) return interaction.reply({ content: 'No images found.', ephemeral: true });

    const image = images[0],
    image_url = image.url,
    breed = image.breeds[0];

    const embed = new MessageEmbed()
    .setTitle(`Here's a ${breed.name}!`)
    .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL())
    .setDescription(`Hi! I'm known to be ${breed.temperament} :D`)
    .setImage(image_url);

    interaction.update({ embeds:[embed] });
}