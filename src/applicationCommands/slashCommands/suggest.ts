import type { SlashCommand } from '#lib/interfaces/Semblance';
import type { TextBasedChannel } from 'discord.js';
import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';

export default {
  permissionRequired: 0,
  run: async (interaction, { options }) => {
    const suggestion = options.getString('suggestion', true),
      embed = new MessageEmbed()
        .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL())
        .setDescription(suggestion),
      component = new MessageActionRow().addComponents([
        new MessageButton()
          .setLabel('Accept')
          .setStyle('SUCCESS')
          .setEmoji('✅')
          .setCustomId(
            JSON.stringify({
              command: 'suggest',
              action: 'accept',
              id: interaction.user.id,
            }),
          ),
        new MessageButton()
          .setLabel('Deny')
          .setStyle('DANGER')
          .setEmoji('❌')
          .setCustomId(
            JSON.stringify({
              command: 'suggest',
              action: 'deny',
              id: interaction.user.id,
            }),
          ),
        new MessageButton()
          .setLabel('Silent Deny')
          .setStyle('DANGER')
          .setEmoji('❌')
          .setCustomId(
            JSON.stringify({
              command: 'suggest',
              action: 'silent-deny',
              id: interaction.user.id,
            }),
          ),
      ]);

    (interaction.guild.channels.cache.find(c => c.name == 'suggestion-review') as TextBasedChannel).send({
      embeds: [embed],
      components: [component],
    });

    interaction.reply({
      content:
        'Your suggestion was recorded successfully! The moderators will first review your suggestion before allowing it onto the suggestions channel. ' +
        "You'll receive a DM when your suggestion is either accepted or denied so make sure to have your DMs opened.",
      ephemeral: true,
    });
  },
} as SlashCommand;
