import { EmbedBuilder } from 'discord.js';
import { applicationCommandToMention, Category, randomColor } from '#constants/index';
import { Command } from '@sapphire/framework';

export default class MiscHelp extends Command {
  public override name = 'mischelp';
  public override description = 'List all miscelaneous commands';
  public override fullCategory = [Category.help];

  public override sharedRun(interaction: Command['SharedBuilder']) {
    const { client } = interaction;

    const funCommands = client.stores
      .get('commands')
      .filter(c => c.category === Category.fun)
      .map(c => `**${c.name}**`);
    const utilityCommands = client.stores
      .get('commands')
      .filter(c => c.category === Category.utility)
      .map(c => `**${c.name}**`);
    const semblanceCommands = client.stores
      .get('commands')
      .filter(c => c.category === Category.semblance)
      .map(c => `**${c.name}**`);

    const embed = new EmbedBuilder()
      .setTitle('Miscellaneous Commands')
      .setThumbnail(client.user.displayAvatarURL())
      .setColor(randomColor)
      .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
      .setDescription(
        `All of the available commands below can be found through the ${applicationCommandToMention({
          client,
          commandName: 'help',
        })} command via the \`query\` option.`,
      )
      .addFields(
        {
          name: '**-> Fun Commands**',
          value: funCommands.join(', '),
          inline: true,
        },
        {
          name: '**-> Utility Commands**',
          value: utilityCommands.join(', '),
          inline: true,
        },
        {
          name: '**-> Semblance-related Commands**',
          value: semblanceCommands.join(', '),
          inline: true,
        },
      );
    return { embeds: [embed] };
  }
}
