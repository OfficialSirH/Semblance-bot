import { Category, randomColor } from '#constants/index';
import { Command } from '#structures/Command';
import { EmbedBuilder, chatInputApplicationCommandMention } from '@discordjs/builders';

export default class MiscHelp extends Command {
  public constructor(client: Command.Requirement) {
    super(client, {
      name: 'mischelp',
      description: 'List all miscelaneous commands',
      fullCategory: [Category.help],
    });
  }

  public override templateRun() {
    const funCommands = this.client.cache.handles.commands
      .filter(c => c.category === Category.fun)
      .map(c => `**${c.name}**`);
    const utilityCommands = this.client.cache.handles.commands
      .filter(c => c.category === Category.utility)
      .map(c => `**${c.name}**`);
    const semblanceCommands = this.client.cache.handles.commands
      .filter(c => c.category === Category.semblance)
      .map(c => `**${c.name}**`);

    const embed = new EmbedBuilder()
      .setTitle('Miscellaneous Commands')
      .setColor(randomColor)

      .setDescription(
        `All of the available commands below can be found through the ${chatInputApplicationCommandMention(
          'help',
          // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
          this.client.cache.data.applicationCommands.find(c => c.name === 'help')?.id!,
        )} command via the \`query\` option.`,
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
    return { embeds: [embed.toJSON()] };
  }
}
