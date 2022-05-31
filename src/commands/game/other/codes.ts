import { type CommandInteraction, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import type { Message } from 'discord.js';
import { Categories, randomColor, Subcategories } from '#constants/index';
import { currentLogo } from '#config';
import { type ApplicationCommandRegistry, Command } from '@sapphire/framework';
import { buildCustomId } from '#constants/components';

export default class Codes extends Command {
  public override name = 'codes';
  public override description = 'get all of the ingame codes';
  public override fullCategory = [Categories.game, Subcategories.other];

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
      .setThumbnail(currentLogo.name)
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
      files: [currentLogo],
      components: [component],
    };
  }

  public registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand({
      name: this.name,
      description: this.description,
    });
  }

  public override async messageRun(message: Message) {
    await message.reply(await this.sharedRun(message));
  }
}
