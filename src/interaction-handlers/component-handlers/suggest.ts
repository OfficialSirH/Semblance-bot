import { disableAllComponents, getPermissionLevel } from '#constants/index';
import { buildCustomId, componentInteractionDefaultParser } from '#constants/components';
import { InteractionHandler, type PieceContext, InteractionHandlerTypes } from '@sapphire/framework';
import {
  type MessageActionRowComponentBuilder,
  type ModalSubmitInteraction,
  type ButtonInteraction,
  type TextBasedChannel,
  ActionRowBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
} from 'discord.js';
import type { ParsedCustomIdData } from '#lib/interfaces/Semblance';

export default class Suggest extends InteractionHandler {
  public constructor(context: PieceContext, options: InteractionHandler.Options) {
    super(context, {
      ...options,
      name: 'suggest',
      interactionHandlerType: InteractionHandlerTypes.ModalSubmit,
    });
  }

  public override parse(interaction: ButtonInteraction) {
    return componentInteractionDefaultParser(this, interaction, { allowOthers: true });
  }

  public async submitSuggestion(interaction: ModalSubmitInteraction) {
    const suggestion = interaction.fields.getTextInputValue('suggestion');

    const embed = new EmbedBuilder()
        .setAuthor({
          name: interaction.user.tag,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setDescription(suggestion),
      component = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setLabel('Accept')
          .setStyle(ButtonStyle.Success)
          .setEmoji('✅')
          .setCustomId(
            buildCustomId({
              command: this.name,
              action: 'accept',
              id: interaction.user.id,
            }),
          ),
        new ButtonBuilder()
          .setLabel('Deny')
          .setStyle(ButtonStyle.Danger)
          .setEmoji('❌')
          .setCustomId(
            buildCustomId({
              command: this.name,
              action: 'deny',
              id: interaction.user.id,
            }),
          ),
        new ButtonBuilder()
          .setLabel('Silent Deny')
          .setStyle(ButtonStyle.Danger)
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

  public override async run(
    interaction: ButtonInteraction<'cached'> | ModalSubmitInteraction<'cached'>,
    data: ParsedCustomIdData<'accept' | 'deny' | 'silent-deny'>,
  ) {
    if (interaction.isModalSubmit()) return this.submitSuggestion(interaction);

    if (getPermissionLevel(interaction.member) == 0)
      return interaction.reply("You don't have permission to use this button!");
    if (!['accept', 'deny', 'silent-deny'].includes(data.action))
      return interaction.reply("Something ain't working right");

    await disableAllComponents(interaction);

    await interaction.update({
      content: `${data.action != 'accept' ? 'denied' : 'accepted'} by ${interaction.user}`,
      components: interaction.message.components,
    });

    if (data.action == 'silent-deny') return;

    const user = await interaction.client.users.fetch(data.id);
    if (data.action == 'accept') {
      user.send(
        'Your suggestion has been accepted! ' +
          'Note: This does not mean that your suggestion is guaranteed to be added in the game or implemented into the server(depending on the type of suggestion). ' +
          'It just means that your suggestion has been accepted into being shown in the suggestions channel where the team may consider your suggestion.',
      );
      return (interaction.guild.channels.cache.find(c => c.name == 'suggestions') as TextBasedChannel).send({
        embeds: [
          new EmbedBuilder()
            .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
            .setDescription(interaction.message.embeds[0].description),
        ],
      });
    }

    if (data.action == 'deny')
      await user
        .send(
          "Your suggestion has been denied. We deny reports if they're either a duplicate, already in-game, " +
            'have no connection to what the game is supposed to be(i.e. "pvp dinosaur battles with Mesozoic Valley dinos"), or aren\'t detailed enough. ' +
            "If you believe this is a mistake, please contact the staff team. You can also edit then resend your suggestion if you think it was a good suggestion that wasn't " +
            ` written right. suggestion: \`\`\`\n${interaction.message.embeds[0].description}\`\`\``,
        )
        .catch(() => null);
  }
}
