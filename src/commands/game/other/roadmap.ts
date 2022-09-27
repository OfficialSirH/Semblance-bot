import { type CommandInteraction, MessageActionRow, MessageButton, MessageEmbed, type Message } from 'discord.js';
import { Category, randomColor, Subcategory, attachments } from '#constants/index';
import { type ApplicationCommandRegistry, Command } from '@sapphire/framework';
import { buildCustomId } from '#constants/components';

export default class Roadmap extends Command {
  public override name = 'roadmap';
  public override description = 'details on the C2S Roadmap';
  public override fullCategory = [Category.game, Subcategory.other];

  public async chatInputRun(interaction: CommandInteraction<'cached'>) {
    await interaction.reply(this.sharedRun(interaction));
  }

  public override sharedRun(builder: Command['SharedBuilder']) {
    const user = 'user' in builder ? builder.user : builder.author;
    const embed = new MessageEmbed()
      .setTitle('Road Map')
      .setColor(randomColor)
      .setThumbnail(attachments.currentLogo.name)
      .setImage(attachments.roadMap.name);
    const components = [
      new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId(
            buildCustomId({
              command: 'roadmap',
              action: 'testers',
              id: user.id,
            }),
          )
          .setStyle('PRIMARY')
          .setLabel('Early Beyond Testers'),
        new MessageButton()
          .setCustomId(
            buildCustomId({
              command: 'roadmap',
              action: 'early-beyond',
              id: user.id,
            }),
          )
          .setStyle('PRIMARY')
          .setLabel('Early Beyond Sneak Peeks'),
      ),
    ];
    return { embeds: [embed], files: [attachments.currentLogo, attachments.roadMap], components };
  }

  public registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand(
      {
        name: this.name,
        description: this.description,
      },
      { idHints: ['995106591441424414'] },
    );
  }

  public override async messageRun(message: Message) {
    await message.reply(this.sharedRun(message));
  }
}
