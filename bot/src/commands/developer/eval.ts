import {
  type ContextMenuCommandInteraction,
  EmbedBuilder,
  AttachmentBuilder,
  ApplicationCommandType,
  PermissionFlagsBits,
} from 'discord.js';
import { GuildId, Category, randomColor } from '#constants/index';
import { type ApplicationCommandRegistry, Command } from '@sapphire/framework';
import { inspect } from 'util';

export default class Eval extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'eval',
      description: 'Evaluate some code.',
      fullCategory: [Category.developer],
      preconditions: ['OwnerOnly'],
    });
  }

  public override async contextMenuRun(interaction: ContextMenuCommandInteraction<'cached'>) {
    const message = interaction.options.getMessage('message');
    if (!message) return interaction.reply({ content: 'Could not find message.', ephemeral: true });
    const content =
      message.content.startsWith('```js\n') && message.content.endsWith('```')
        ? message.content.slice(6, -3)
        : message.content;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { client } = interaction;
    const embed = new EmbedBuilder()
      .setColor(randomColor)
      .addFields({ name: '📥 Input', value: `\`\`\`js\n${content.substring(0, 1015)}\`\`\`` })
      .setFooter({ text: 'Feed me code!' });
    try {
      let evaled = eval(`(async () => { ${content} })().catch(e => { return "Error: " + e })`);
      Promise.resolve(evaled).then(async result => {
        evaled = result;
        if (typeof evaled != 'string') evaled = inspect(evaled);
        const data: { embeds: EmbedBuilder[] | undefined; files: AttachmentBuilder[] } = {
          embeds: undefined,
          files: [],
        };
        if (evaled.length > 1015) {
          const evalOutputFile = new AttachmentBuilder(Buffer.from(`${evaled}`), { name: 'evalOutput.js' });
          data.files = [evalOutputFile];
          embed
            .addFields({ name: '📤 Output', value: 'Output is in file preview above' })
            .setTitle('✅ Evaluation Completed');
        } else
          embed
            .addFields({ name: '📤 Output', value: `\`\`\`js\n${evaled.substring(0, 1015)}\`\`\`` })
            .setTitle('✅ Evaluation Completed');
        data.embeds = [embed];
        await interaction.reply(data);
      });
    } catch (e) {
      if (typeof e == 'string')
        // eslint-disable-next-line no-ex-assign
        e = e.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
      embed
        .addFields({ name: '📤 Output', value: `\`\`\`fix\n${(e as object).toString().substring(0, 1014)}\`\`\`` })
        .setTitle('❌ Evaluation Failed');
      await interaction.reply({ embeds: [embed] });
    }
  }

  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerContextMenuCommand(
      {
        name: this.name,
        type: ApplicationCommandType.Message,
        default_member_permissions: PermissionFlagsBits.Administrator.toString(),
      },
      {
        guildIds: [GuildId.cellToSingularity],
      },
    );
  }
}
