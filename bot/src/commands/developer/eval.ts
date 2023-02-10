import { GuildId, Category, randomColor, PreconditionName } from '#constants/index';
import { Command } from '#structures/Command';
import { inspect } from 'util';
import {
  type APIContextMenuInteraction,
  ApplicationCommandType,
  MessageFlags,
  PermissionFlagsBits,
  type RESTPostAPIApplicationCommandsJSONBody,
  type APIEmbed,
} from '@discordjs/core';
import { Attachy } from '#structures/Attachy';
import { EmbedBuilder } from '@discordjs/builders';
import type { FastifyReply } from 'fastify';
import type { InteractionOptionResolver } from '#structures/InteractionOptionResolver';

export default class Eval extends Command {
  public constructor(client: Command.Requirement) {
    super(client, {
      name: 'eval',
      description: 'Evaluate some code.',
      fullCategory: [Category.developer],
      preconditions: [PreconditionName.OwnerOnly],
    });
  }

  public override async contextMenuRun(
    res: FastifyReply,
    interaction: APIContextMenuInteraction,
    options: InteractionOptionResolver,
  ) {
    const message = options.getMessage();
    if (!message)
      return this.client.api.interactions.reply(res, {
        content: 'Could not find message.',
        flags: MessageFlags.Ephemeral,
      });
    const content =
      message.content.startsWith('```js\n') && message.content.endsWith('```')
        ? message.content.slice(6, -3)
        : message.content;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { client } = this;
    const embed = new EmbedBuilder()
      .setColor(randomColor)
      .addFields({ name: '📥 Input', value: `\`\`\`js\n${content.substring(0, 1015)}\`\`\`` })
      .setFooter({ text: 'Feed me code!' });
    try {
      let evaled = eval(`(async () => { ${content} })().catch(e => { return "Error: " + e })`);
      Promise.resolve(evaled).then(async result => {
        evaled = result;
        if (typeof evaled != 'string') evaled = inspect(evaled);
        const data: { embeds?: APIEmbed[] | undefined; files: Attachy[] } = {
          files: [],
        };
        if (evaled.length > 1015) {
          const evalOutputFile = new Attachy(Buffer.from(`${evaled}`), 'evalOutput.js');
          data.files = [evalOutputFile];
          embed
            .addFields({ name: '📤 Output', value: 'Output is in file preview above' })
            .setTitle('✅ Evaluation Completed');
        } else
          embed
            .addFields({ name: '📤 Output', value: `\`\`\`js\n${evaled.substring(0, 1015)}\`\`\`` })
            .setTitle('✅ Evaluation Completed');
        data.embeds = [embed.toJSON()];
        await this.client.api.interactions.reply(res, data);
      });
    } catch (e) {
      if (typeof e == 'string')
        // eslint-disable-next-line no-ex-assign
        e = e.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
      embed
        .addFields({ name: '📤 Output', value: `\`\`\`fix\n${(e as object).toString().substring(0, 1014)}\`\`\`` })
        .setTitle('❌ Evaluation Failed');
      await this.client.api.interactions.reply(res, { embeds: [embed.toJSON()] });
    }
  }

  public override data() {
    return {
      command: {
        name: this.name,
        type: ApplicationCommandType.Message,
        default_member_permissions: PermissionFlagsBits.Administrator.toString(),
      } satisfies RESTPostAPIApplicationCommandsJSONBody,
      guildIds: [GuildId.cellToSingularity],
    };
  }
}
