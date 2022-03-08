import { Categories } from '#constants/index';
import { buildCustomId } from '#constants/components';
import { Command } from '@sapphire/framework';
import type { CommandInteraction, TextBasedChannel } from 'discord.js';
import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';

export default class Suggest extends Command {
  public override name = 'suggest';
  public override description = 'Submit suggestions for Cell to Singularity or the server.';
  public override fullCategory = [Categories.c2sServer];

  public override async chatInputRun(interaction: CommandInteraction<'cached'>) {
    const suggestion = interaction.options.getString('suggestion');

    if (!suggestion) return interaction.reply('Please provide a suggestion.');

    const embed = new MessageEmbed()
        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
        .setDescription(suggestion),
      component = new MessageActionRow().addComponents(
        new MessageButton()
          .setLabel('Accept')
          .setStyle('SUCCESS')
          .setEmoji('✅')
          .setCustomId(
            buildCustomId({
              command: this.name,
              action: 'accept',
              id: interaction.user.id,
            }),
          ),
        new MessageButton()
          .setLabel('Deny')
          .setStyle('DANGER')
          .setEmoji('❌')
          .setCustomId(
            buildCustomId({
              command: this.name,
              action: 'deny',
              id: interaction.user.id,
            }),
          ),
        new MessageButton()
          .setLabel('Silent Deny')
          .setStyle('DANGER')
          .setEmoji('❌')
          .setCustomId(
            buildCustomId({
              command: this.name,
              action: 'silent-deny',
              id: interaction.user.id,
            }),
          ),
      );

    (interaction.guild.channels.cache.find(c => c.name == 'suggestion-review') as TextBasedChannel).send({
      embeds: [embed],
      components: [component],
    });

    await interaction.reply({
      content:
        'Your suggestion was recorded successfully! The moderators will first review your suggestion before allowing it onto the suggestions channel. ' +
        "You'll receive a DM when your suggestion is either accepted or denied so make sure to have your DMs opened.",
      ephemeral: true,
    });
  }
}