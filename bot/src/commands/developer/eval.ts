import { GuildId, Category, randomColor, PreconditionName } from '#constants/index';
import { Command } from '#structures/Command';
import { inspect } from 'util';
import type { ApplicationCommandRegistry } from '@sapphire/framework';
import { ApplicationCommandType, PermissionFlagsBits } from '@discordjs/core';

export default class Eval extends Command {
  public constructor(client: Command.Requirement) {
    super(client, {
      name: 'eval',
      description: 'Evaluate some code.',
      fullCategory: [Category.developer],
      preconditions: [PreconditionName.OwnerOnly],
    });
  }

  public override async contextMenuRun(interaction: APIContextMenuInteraction) {
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
        const data: { embeds: EmbedBuilder[] | undefined; files: Attachy[] } = {
          embeds: undefined,
          files: [],
        };
        if (evaled.length > 1015) {
          const evalOutputFile = new Attachy(Buffer.from(`${evaled}`), { name: 'evalOutput.js' });
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
