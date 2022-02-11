import type { SlashCommand } from '#lib/interfaces/Semblance';
import { ButtonStyle, TextBasedChannel } from 'discord.js';
import { ActionRow, ButtonComponent, Embed } from 'discord.js';

export default {
  permissionRequired: 0,
  run: async (interaction, { options }) => {
    const suggestion = options.getString('suggestion', true),
      embed = new Embed()
        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
        .setDescription(suggestion),
      component = new ActionRow().addComponents(
        new ButtonComponent()
          .setLabel('Accept')
          .setStyle(ButtonStyle.Success)
          .setEmoji({ name: '✅' })
          .setCustomId(
            JSON.stringify({
              command: 'suggest',
              action: 'accept',
              id: interaction.user.id,
            }),
          ),
        new ButtonComponent()
          .setLabel('Deny')
          .setStyle(ButtonStyle.Danger)
          .setEmoji({ name: '❌' })
          .setCustomId(
            JSON.stringify({
              command: 'suggest',
              action: 'deny',
              id: interaction.user.id,
            }),
          ),
        new ButtonComponent()
          .setLabel('Silent Deny')
          .setStyle(ButtonStyle.Danger)
          .setEmoji({ name: '❌' })
          .setCustomId(
            JSON.stringify({
              command: 'suggest',
              action: 'silent-deny',
              id: interaction.user.id,
            }),
          ),
      );

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
