import { type Message, type CommandInteraction, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import { Category, randomColor, Subcategory, attachments } from '#constants/index';
import { type ApplicationCommandRegistry, Command } from '@sapphire/framework';
import { buildCustomId } from '#constants/components';

export default class Codes extends Command {
  public override name = 'codes';
  public override description = 'get all of the ingame codes';
  public override fullCategory = [Category.game, Subcategory.other];

  public async chatInputRun(interaction: CommandInteraction<'cached'>) {
    await interaction.reply(await this.sharedRun(interaction));
  }

  public override async sharedRun(builder: Command['SharedBuilder']) {
    const user = 'user' in builder ? builder.user : builder.author;
    const codeHandler = await this.container.client.db.information.findUnique({ where: { type: 'codes' } });
    const embed = new MessageEmbed()
      .setTitle('Darwinium Codes')
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setColor(randomColor)
      .setThumbnail(attachments.currentLogo.name)
      .setDescription(codeHandler.value)
      .setFooter({ text: codeHandler.footer });
    const component = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId(
          buildCustomId({
            command: 'codes',
            action: 'expired',
            id: user.id,
          }),
        )
        .setLabel('View Expired Codes')
        .setStyle('PRIMARY'),
    );
    return {
      embeds: [embed],
      files: [attachments.currentLogo],
      components: [component],
    };
  }

  public registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand(
      {
        name: this.name,
        description: this.description,
      },
      {
        idHints: ['995106590581608458'],
      },
    );
  }

  public override async messageRun(message: Message) {
    await message.reply(await this.sharedRun(message));
  }
}
