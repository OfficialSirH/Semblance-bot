import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import type { sizeType } from '#lib/interfaces/catAndDogAPI';
import { fetchCatOrDog } from '#constants/commands';
import type { SlashCommand } from '#lib/interfaces/Semblance';

export default {
  permissionRequired: 0,
  run: async interaction => {
    let wantsCat: boolean, commandFailed: boolean;
    try {
      wantsCat = interaction.options.getSubcommand() === 'cat';
    } catch (e) {
      commandFailed = true;
      await interaction.reply({ content: "Something didn't work quite right. Please try again.", ephemeral: true });
    }
    if (commandFailed) return;
    const query_params = {
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

    const embed = new MessageEmbed()
      .setTitle(`Here's a ${breed.name}!`)
      .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL())
      .setDescription(`Hi! I'm known to be ${breed.temperament} :D`)
      .setImage(image_url);

    const components = [
      new MessageActionRow().addComponents([
        new MessageButton()
          .setLabel('Refresh')
          .setEmoji('🔄')
          .setStyle('SECONDARY')
          .setCustomId(
            JSON.stringify({
              command: 'imagegen',
              action: `refresh-${wantsCat ? 'cat' : 'dog'}`,
              id: interaction.user.id,
            }),
          ),
      ]),
    ];

    return interaction.reply({
      embeds: [embed],
      components,
    });
  },
} as SlashCommand;
