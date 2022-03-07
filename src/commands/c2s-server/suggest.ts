import { Categories } from '#constants/index';
import { buildCustomId } from '#constants/components';
import { Command } from '@sapphire/framework';
import { ButtonStyle, type ChatInputCommandInteraction, type TextBasedChannel } from 'discord.js';
import { ActionRow, ButtonComponent, Embed } from 'discord.js';

export default class Suggest extends Command {
  public override name = 'suggest';
  public override description = 'Submit suggestions for Cell to Singularity or the server.';
  public override fullCategory = [Categories.c2sServer];

  public override async chatInputRun(interaction: ChatInputCommandInteraction<'cached'>) {
    const suggestion = interaction.options.getString('suggestion');

    if (!suggestion) return interaction.reply('Please provide a suggestion.');

    const embed = new Embed()
        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
        .setDescription(suggestion),
      component = new ActionRow().addComponents(
        new ButtonComponent()
          .setLabel('Accept')
          .setStyle(ButtonStyle.Success)
          .setEmoji({ name: '✅' })
          .setCustomId(
            buildCustomId({
              command: this.name,
              action: 'accept',
              id: interaction.user.id,
            }),
          ),
        new ButtonComponent()
          .setLabel('Deny')
          .setStyle(ButtonStyle.Danger)
          .setEmoji({ name: '❌' })
          .setCustomId(
            buildCustomId({
              command: this.name,
              action: 'deny',
              id: interaction.user.id,
            }),
          ),
        new ButtonComponent()
          .setLabel('Silent Deny')
          .setStyle(ButtonStyle.Danger)
          .setEmoji({ name: '❌' })
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
