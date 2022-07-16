import { type ContextMenuInteraction, MessageEmbed, MessageAttachment } from 'discord.js';
import { Categories, prefix, randomColor } from '#constants/index';
import type { Message } from 'discord.js';
import { type ApplicationCommandRegistry, Command } from '@sapphire/framework';
import { inspect } from 'util';
import { c2sGuildId, sirhGuildId } from '#config';

export default class Eval extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'eval',
      description: 'Evaluate some code.',
      fullCategory: [Categories.developer],
      preconditions: ['OwnerOnly'],
    });
  }

  public async evalSharedRun(builder: Message | ContextMenuInteraction, content: string) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { client } = builder;
    const embed = new MessageEmbed()
      .setColor(randomColor)
      .addField('📥 Input', `\`\`\`js\n${content.substring(0, 1015)}\`\`\``)
      .setFooter({ text: 'Feed me code!' });
    try {
      let evaled = eval(`(async () => { ${content} })().catch(e => { return "Error: " + e })`);
      Promise.resolve(evaled).then(async result => {
        evaled = result;
        if (typeof evaled != 'string') evaled = inspect(evaled);
        const data = { embeds: null, files: [] };
        if (evaled.length > 1015) {
          const evalOutputFile = new MessageAttachment(Buffer.from(`${evaled}`), 'evalOutput.js');
          data.files = [evalOutputFile];
          embed.addField('📤 Output', 'Output is in file preview above').setTitle('✅ Evaluation Completed');
        } else
          embed
            .addField('📤 Output', `\`\`\`js\n${evaled.substring(0, 1015)}\`\`\``)
            .setTitle('✅ Evaluation Completed');
        data.embeds = [embed];
        await builder.reply(data);
      });
    } catch (e) {
      if (typeof e == 'string')
        // eslint-disable-next-line no-ex-assign
        e = e.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
      embed
        .addField('📤 Output', `\`\`\`fix\n${e.toString().substring(0, 1014)}\`\`\``)
        .setTitle('❌ Evaluation Failed');
      await builder.reply({ embeds: [embed] });
    }
  }

  public override async messageRun(message: Message) {
    const content = message.content.slice(prefix.length + this.name.length + 1);
    await this.evalSharedRun(message, content);
  }

  public override async contextMenuRun(interaction: ContextMenuInteraction<'cached'>) {
    const message = interaction.options.getMessage('message');
    if (!message) return interaction.reply({ content: 'Could not find message.', ephemeral: true });
    const content =
      message.content.startsWith('```js\n') && message.content.endsWith('```')
        ? message.content.slice(6, -3)
        : message.content;
    await this.evalSharedRun(interaction, content);
  }

  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerContextMenuCommand(
      {
        name: this.name,
        type: 'MESSAGE',
        defaultPermission: false,
      },
      {
        guildIds: [c2sGuildId, sirhGuildId],
        idHints: ['973689160412069938', '973689161179607111'],
      },
    );
  }
}
