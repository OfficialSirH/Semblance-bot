import { ActionRow, ButtonComponent, ButtonStyle, type ChatInputCommandInteraction, Embed } from 'discord.js';
import type { Message } from 'discord.js';
import { Categories, randomColor } from '#constants/index';
import { type ApplicationCommandRegistry, Command } from '@sapphire/framework';
import { currentPrice } from '#src/constants/commands';
import { buildCustomId } from '#src/constants/components';

export default class Game extends Command {
  public override name = 'game';
  public override description = 'An idle-game within Semblance';
  public override fullCategory = [Categories.fun];

  public override async sharedRun(builder: Command['SharedBuilder']) {
    const user = 'user' in builder ? builder.user : builder.author;
    const client = builder.client;

    const statsHandler = await client.db.game.findUnique({ where: { player: user.id } }),
      embed = new Embed();
    let cost: number;
    if (!statsHandler)
      embed
        .setTitle("Semblance's Idle-Game")
        .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
        .setDescription(
          [
            'Use the buttons below to play the game. :D',
            "If you can't see the buttons, you need to update your Discord.\n",
            'About - explains the game and its rules',
            'Collect - collect earnings',
            'Upgrade - upgrade profit',
            'Leaderboard - see top 20 players',
            'Vote - list of voting sites to earn bonus currency',
          ].join('\n'),
        );
    else
      embed
        .setTitle("Welcome back to Semblance's Idle-Game!")
        .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
        .setColor(randomColor)
        .setThumbnail(user.displayAvatarURL())
        .addFields(
          { name: 'Level', value: statsHandler.level.toString() },
          {
            name: 'Random-Bucks',
            value: statsHandler.money.toFixed(3).toString(),
          },
          {
            name: 'Percent Increase',
            value: statsHandler.percentIncrease.toString(),
          },
          {
            name: 'Next Upgrade Cost',
            value: (await currentPrice(client, statsHandler)).toFixed(3).toString(),
          },
          {
            name: 'Idle Profit',
            value: statsHandler.profitRate.toFixed(3).toString(),
          },
        )
        .setFooter({ text: 'Remember to vote for Semblance to gain a production boost!' }),
        (cost = await currentPrice(client, statsHandler));

    const components = [
      new ActionRow().addComponents(
        new ButtonComponent()
          .setCustomId(
            buildCustomId({
              command: 'game',
              action: 'about',
              id: user.id,
            }),
          )
          .setStyle(ButtonStyle.Primary)
          .setEmoji({ name: '❔' })
          .setLabel('About'),
        new ButtonComponent()
          .setCustomId(
            buildCustomId({
              command: 'game',
              action: 'collect',
              id: user.id,
            }),
          )
          .setDisabled(!statsHandler)
          .setStyle(ButtonStyle.Primary)
          .setEmoji({ name: '💵' })
          .setLabel('Collect'),
        new ButtonComponent()
          .setCustomId(
            buildCustomId({
              command: 'game',
              action: 'upgrade',
              id: user.id,
            }),
          )
          .setDisabled(!statsHandler || statsHandler.money < cost)
          .setStyle(ButtonStyle.Primary)
          .setEmoji({ name: '⬆' })
          .setLabel('Upgrade'),
        new ButtonComponent()
          .setCustomId(
            buildCustomId({
              command: 'game',
              action: 'leaderboard',
              id: user.id,
            }),
          )
          .setStyle(ButtonStyle.Primary)
          .setEmoji({ name: '🏅' })
          .setLabel('Leaderboard'),
        new ButtonComponent()
          .setCustomId(
            buildCustomId({
              command: 'game',
              action: 'vote',
              id: user.id,
            }),
          )
          .setStyle(ButtonStyle.Primary)
          .setEmoji({ name: '💰' })
          .setLabel('Voting Sites'),
      ),
    ];

    return {
      content: "note: There's a slash command for this now, if your Discord client allows it, you can use /game",
      embeds: [embed],
      components,
    };
  }

  public override async messageRun(message: Message) {
    await message.reply(await this.sharedRun(message));
  }

  public override async chatInputRun(interaction: ChatInputCommandInteraction<'cached'>) {
    await interaction.reply(await this.sharedRun(interaction));
  }

  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand({
      name: this.name,
      description: this.description,
    });
  }
}
