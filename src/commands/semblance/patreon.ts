import { ActionRow, ButtonComponent, ButtonStyle, Embed } from 'discord.js';
import type { Message, ChatInputCommandInteraction } from 'discord.js';
import { Categories } from '#constants/index';
import { patreon, sirhGuildId } from '#config';
import { type ApplicationCommandRegistry, Command } from '@sapphire/framework';

export default class Patreon extends Command {
  public override name = 'patreon';
  public override description = "Get the link to SirH's patreon page";
  public override fullCategory = [Categories.semblance];

  public override sharedRun(builder: Command['SharedBuilder']) {
    const component = new ActionRow().addComponents(
      new ButtonComponent()
        .setStyle(ButtonStyle.Link)
        .setLabel('CLICK ME!')
        .setEmoji(builder.client.guilds.cache.get(sirhGuildId).emojis.cache.find(c => c.name == 'SirUwU'))
        .setURL('https://www.patreon.com/SirHDeveloper'),
    );
    const embed = new Embed()
      .setTitle('My Patreon')
      .setURL('https://www.patreon.com/SirHDeveloper')
      .setImage(patreon.name)
      .setDescription(
        [
          'The rewards for becoming a patreon are:',
          '- You get access to Semblance Beta *whenever I actually use the bot for testing*',
          "- You get a hoisted role in my Discord server (SirH's Stuff)",
          '- Make me very happy',
        ].join('\n'),
      );

    return {
      content: 'Support me on [Patreon](https://www.patreon.com/SirHDeveloper)!',
      components: [component],
      embeds: [embed],
      files: [patreon],
    };
  }

  public override async messageRun(message: Message) {
    await message.reply(this.sharedRun(message));
  }

  public override async chatInputRun(interaction: ChatInputCommandInteraction<'cached'>) {
    await interaction.reply(this.sharedRun(interaction));
  }

  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand({
      name: this.name,
      description: this.description,
    });
  }
}
