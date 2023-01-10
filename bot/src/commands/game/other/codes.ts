import {
  type ChatInputCommandInteraction,
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  ButtonStyle,
  type MessageActionRowComponentBuilder,
} from 'discord.js';
import { Category, randomColor, Subcategory, attachments } from '#constants/index';
import { Command } from '#structures/Command';
import { buildCustomId } from '#constants/components';

export default class Codes extends Command {
  public override name = 'codes';
  public override description = 'get all of the ingame codes';
  public override category = [Category.game, Subcategory.other];

  public override async chatInputRun(res: FastifyReply, interaction: APIApplicationCommandInteraction) {
    await interaction.reply(await this.sharedRun(interaction));
  }

  public override async sharedRun(interaction: Command['SharedBuilder']) {
    const codeHandler = await this.client.db.information.findUnique({ where: { type: 'codes' } });
    if (!codeHandler) return 'No codes found.';
    const embed = new EmbedBuilder()
      .setTitle('Darwinium Codes')
      .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
      .setColor(randomColor)
      .setThumbnail(attachments.currentLogo.name)
      .setDescription(codeHandler.value)
      .setFooter({ text: codeHandler.footer as string });
    const component = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(
          buildCustomId({
            command: 'codes',
            action: 'expired',
            id: interaction.user.id,
          }),
        )
        .setLabel('View Expired Codes')
        .setStyle(ButtonStyle.Primary),
    );
    return {
      embeds: [embed],
      files: [attachments.currentLogo.attachment],
      components: [component],
    };
  }

  public registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand(
      {
        name: this.name,
        description: this.description,
      },
      {},
    );
  }
}
