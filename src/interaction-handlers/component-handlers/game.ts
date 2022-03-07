import { type ButtonInteraction, ButtonStyle, type MessageComponentInteraction } from 'discord.js';
import { ActionRow, ButtonComponent, Embed } from 'discord.js';
import { prefix, randomColor } from '#constants/index';
import { InteractionHandler, InteractionHandlerTypes, type PieceContext } from '@sapphire/framework';
import { currentPrice } from '#constants/commands';
import { LeaderboardUtilities } from '#src/structures/LeaderboardUtilities';
import type { Game } from '@prisma/client';
import {
  buildCustomId,
  componentInteractionDefaultParser,
  defaultEmojiToUsableEmoji,
  disableComponentsByLabel,
  filterAction,
} from '#src/constants/components';
import type { ParsedCustomIdData } from 'Semblance';

export default class GameHandler extends InteractionHandler {
  public constructor(context: PieceContext, options: InteractionHandler.Options) {
    super(context, {
      ...options,
      name: 'game',
      interactionHandlerType: InteractionHandlerTypes.Button,
    });
  }

  public override parse(interaction: ButtonInteraction) {
    return componentInteractionDefaultParser(this, interaction);
  }

  public override async run(
    interaction: ButtonInteraction,
    data: ParsedCustomIdData<
      'create' | 'reset' | 'about' | 'collect' | 'upgrade' | 'leaderboard' | 'vote' | 'stats' | 'close'
    >,
  ) {
    const id = interaction.user.id;
    const game = await interaction.client.db.game.findUnique({ where: { player: id } });
    let cost: number, components: ActionRow[];
    if (game) cost = await currentPrice(interaction.client, game);

    const mainComponents = [
        new ActionRow().addComponents(
          new ButtonComponent()
            .setCustomId(
              buildCustomId({
                command: this.name,
                action: 'about',
                id,
              }),
            )
            .setStyle(ButtonStyle.Primary)
            .setEmoji(defaultEmojiToUsableEmoji('❔'))
            .setLabel('About'),
          new ButtonComponent()
            .setCustomId(
              buildCustomId({
                command: this.name,
                action: 'collect',
                id,
              }),
            )
            .setDisabled(!game)
            .setStyle(ButtonStyle.Primary)
            .setEmoji(defaultEmojiToUsableEmoji('💵'))
            .setLabel('Collect'),
          new ButtonComponent()
            .setCustomId(
              buildCustomId({
                command: this.name,
                action: 'upgrade',
                id,
              }),
            )
            .setDisabled(!game || game.money < cost)
            .setStyle(ButtonStyle.Primary)
            .setEmoji(defaultEmojiToUsableEmoji('⬆'))
            .setLabel('Upgrade'),
          new ButtonComponent()
            .setCustomId(
              buildCustomId({
                command: this.name,
                action: 'leaderboard',
                id,
              }),
            )
            .setStyle(ButtonStyle.Primary)
            .setEmoji(defaultEmojiToUsableEmoji('🏅'))
            .setLabel('Leaderboard'),
          new ButtonComponent()
            .setCustomId(
              buildCustomId({
                command: this.name,
                action: 'vote',
                id,
              }),
            )
            .setStyle(ButtonStyle.Primary)
            .setEmoji(defaultEmojiToUsableEmoji('💰'))
            .setLabel('Voting Sites'),
        ),
      ],
      endComponents = [
        new ActionRow().addComponents(
          new ButtonComponent()
            .setCustomId(
              buildCustomId({
                command: this.name,
                action: 'stats',
                id,
              }),
            )
            .setDisabled(!game)
            .setStyle(ButtonStyle.Primary)
            .setEmoji(defaultEmojiToUsableEmoji('🔢'))
            .setLabel('Stats'),
          new ButtonComponent()
            .setCustomId(
              buildCustomId({
                command: this.name,
                action: 'create',
                id,
              }),
            )
            .setEmoji(defaultEmojiToUsableEmoji(game ? '⛔' : '🌎'))
            .setLabel(game ? 'Reset Progress' : 'Create new game')
            .setStyle(game ? ButtonStyle.Danger : ButtonStyle.Success),
          new ButtonComponent()
            .setCustomId(
              buildCustomId({
                command: this.name,
                action: 'close',
                id,
              }),
            )
            .setEmoji(defaultEmojiToUsableEmoji('🚫'))
            .setLabel('Close')
            .setStyle(ButtonStyle.Secondary),
        ),
      ];
    if (['about', 'collect', 'upgrade', 'leaderboard', 'vote'].includes(data.action)) components = endComponents;
    else if (data.action == 'stats') components = mainComponents;
    else components = filterAction(endComponents, data.action);

    switch (data.action) {
      case 'create':
        game ? askConfirmation(interaction) : create(interaction, components);
        break;
      case 'reset':
        create(interaction, components);
        break;
      case 'about':
        about(interaction, components);
        break;
      case 'collect':
        collect(interaction, components);
        break;
      case 'upgrade':
        upgrade(interaction, components);
        break;
      case 'leaderboard':
        leaderboard(interaction, components);
        break;
      case 'vote':
        votes(interaction, components);
        break;
      case 'stats':
        stats(interaction, components, game);
        break;
      case 'close':
        interaction.channel.messages.delete(interaction.message.id);
    }
  }
}

async function askConfirmation(interaction: MessageComponentInteraction) {
  const { user } = interaction;
  const components = [
    new ActionRow().addComponents(
      new ButtonComponent()
        .setCustomId(
          buildCustomId({
            command: this.name,
            action: 'reset',
            id: user.id,
          }),
        )
        .setEmoji(defaultEmojiToUsableEmoji('🚫'))
        .setLabel('Yes')
        .setStyle(ButtonStyle.Danger),
      new ButtonComponent()
        .setCustomId(
          buildCustomId({
            command: this.name,
            action: 'close',
            id: user.id,
          }),
        )
        .setLabel('No')
        .setStyle(ButtonStyle.Secondary),
    ),
  ];
  await interaction.update({
    content: 'Are you sure you want to reset your progress?',
    embeds: [],
    components,
  });
}

async function create(interaction: MessageComponentInteraction, components: ActionRow[]) {
  const { user } = interaction;
  const percent = (Math.round(Math.random() * 25) + 25) / 100 + 1;
  const startingProfits = Math.random() * 0.05 + 0.05;

  const creationHandler = await interaction.client.db.game.upsert({
    where: {
      player: user.id,
    },
    create: {
      player: user.id,
      percentIncrease: percent,
      profitRate: startingProfits,
      cost: 1,
    },
    update: {
      level: 1,
      checkedLevel: 1,
      money: 0,
      percentIncrease: percent,
      profitRate: startingProfits,
      cost: 1,
    },
  });

  const embed = new Embed()
    .setTitle('Game Created')
    .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
    .setColor(randomColor)
    .setDescription(
      `Game Successfully created! Now you can start collecting Random-Bucks by typing '${prefix}game collect' and upgrade your Random-Bucks with \`${prefix}game upgrade\`\n\n` +
        `Price Increase: ${(creationHandler.percentIncrease - 1) * 100}%\n` +
        `Starting Profits: ${creationHandler.profitRate.toFixed(3)}/sec\n\n` +
        "Reminder, don't be constantly spamming and creating a new game just cause your RNG stats aren't perfect \n",
    )
    .setFooter({ text: 'Enjoy idling!' });
  components = disableComponentsByLabel(components, ['Collect', 'Stats'], { enableInstead: true });
  await interaction.update({ embeds: [embed], components });
}

async function about(interaction: MessageComponentInteraction, components: ActionRow[]) {
  const { user } = interaction;
  const embed = new Embed()
    .setTitle("What's Semblance's Idle-Game about?")
    .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
    .setColor(randomColor)
    .setDescription(
      "SIG, AKA Semblance's Idle-Game, is an RNG idle-game that uses a currency called Random-Bucks \n" +
        `which yes, I asked Semblance whether or not I should use Random-Bucks as the name by using \`${prefix}8ball\`. ` +
        'If you\'re confused by the acronym RNG, it\'s an acronym for "Random Number Generation/Generator", which ' +
        'means that everything is kind of random and runs on random chance in the game. Everything that is random ' +
        'within this game is the cost multiplier per upgrade, starting profits, and the amount your profits increase.\n\n' +
        'You have to collect Random-Bucks manually every once in a while, that is how the game works.',
    )
    .setFooter({ text: 'Noice' });
  await interaction.update({ embeds: [embed], components });
}

async function collect(interaction: MessageComponentInteraction, components: ActionRow[]) {
  const { user } = interaction;
  let collectionHandler = await interaction.client.db.game.findUnique({ where: { player: user.id } });
  const collected = collectionHandler.profitRate * ((Date.now() - collectionHandler.lastCollected.valueOf()) / 1000);

  collectionHandler = await interaction.client.db.game.update({
    where: {
      player: user.id,
    },
    data: {
      money: {
        increment: collected,
      },
    },
  });

  const embed = new Embed()
    .setTitle('Balance')
    .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
    .setColor(randomColor)
    .setDescription(
      `You've collected ${collected.toFixed(
        3,
      )} Random-Bucks and now your current balance is ${collectionHandler.money.toFixed(3)} Random-Bucks.`,
    );
  await interaction.update({ embeds: [embed], components });
}

async function upgrade(interaction: ButtonInteraction, components: ActionRow[]) {
  await interaction.deferUpdate();
  const { user } = interaction;
  const message =
    'edit' in interaction.message
      ? interaction.message
      : await interaction.channel.messages.fetch(interaction.message.id);

  let upgradeHandler = await interaction.client.db.game.findUnique({ where: { player: user.id } });
  const previousLevel = upgradeHandler.level;
  let costSubtraction = await currentPrice(interaction.client, upgradeHandler);
  if (upgradeHandler.money < costSubtraction)
    return message.edit({
      embeds: [
        new Embed()
          .setTitle('Not Enough Random-Bucks')
          .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
          .setColor(randomColor)
          .setDescription(
            [
              `**Current Balance:** ${upgradeHandler.money.toFixed(3)} Random-Bucks`,
              `**Upgrade Cost:** ${costSubtraction.toFixed(3)} Random-Bucks`,
              `**How much more required:** ${(costSubtraction - upgradeHandler.money).toFixed(3)} Random-Bucks`,
            ].join('\n'),
          ),
      ],
      components,
    });

  while (upgradeHandler.money > costSubtraction) {
    costSubtraction = await currentPrice(interaction.client, upgradeHandler);
    upgradeHandler = await interaction.client.db.game.update({
      where: {
        player: user.id,
      },
      data: {
        money: {
          decrement: costSubtraction,
        },
        level: {
          increment: 1,
        },
        profitRate: {
          multiply: Math.random() * 0.05 + 1.05,
        },
      },
    });
  }

  const embed = new Embed()
    .setTitle('Upgrade Stats')
    .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
    .setColor(randomColor)
    .setDescription(
      `You have successfully upgrade from level ${previousLevel} => ${
        upgradeHandler.level
      }.\n\nYour current balance is ${upgradeHandler.money.toFixed(
        3,
      )} Random-Bucks.\n\nYour current profit is ${upgradeHandler.profitRate.toFixed(3)} Random-Bucks/sec.`,
    )
    .setFooter({
      text: `Upgrades will raise your rank in the '${prefix}game leaderboard', also, '${prefix}game upgrade max' will upgrade the max amount you're able to upgrade.`,
    });
  await message.edit({ embeds: [embed], components });
}

async function leaderboard(interaction: MessageComponentInteraction, components: ActionRow[]) {
  const { user } = interaction;
  let leaderboard = await LeaderboardUtilities.topTwenty(interaction.client, 'game');
  if (!leaderboard) leaderboard = 'There is currently no one who has upgraded their income.';
  const embed = new Embed()
    .setTitle("Semblance's idle-game leaderboard")
    .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
    .setColor(randomColor)
    .setDescription(`${leaderboard}`)
    .setFooter({ text: 'May the odds be with you.' });
  await interaction.update({ embeds: [embed], components });
}

async function votes(interaction: MessageComponentInteraction, components: ActionRow[]) {
  const { user, client } = interaction,
    embed = new Embed()
      .setTitle('Vote')
      .setColor(randomColor)
      .setThumbnail(client.user.displayAvatarURL())
      .setDescription(
        [
          '**Rewardable voting sites**',
          `[Top.gg](https://top.gg/bot/${client.user.id})`,
          '[Discordbotlist.com](https://discordbotlist.com/bots/semblance)',
          `[Discords.com](https://discords.com/bots/bot/${client.user.id})`,
          `[Discord.boats](https://discord.boats/bot/${client.user.id})`,
          '**Unrewardable voting sites**',
          `[Botlist.space](https://botlist.space/bot/${client.user.id})`,
          '**Unvotable sites**',
          `[Discord.bots.gg](https://discord.bots.gg/bots/${client.user.id})`,
        ].join('\n'),
      )
      .setFooter({
        text: `Thanks, ${user.tag}, for considering to support my bot through voting, you may also support me with ${prefix}patreon :D`,
        iconURL: user.displayAvatarURL(),
      });
  interaction.update({ embeds: [embed], components });
}

async function stats(interaction: ButtonInteraction, components: ActionRow[], game: Game) {
  const { user } = interaction;
  const embed = new Embed()
    .setTitle("Welcome back to Semblance's Idle-Game!")
    .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
    .setColor(randomColor)
    .setThumbnail(user.displayAvatarURL())
    .addFields(
      { name: 'Level', value: game.level.toString() },
      { name: 'Random-Bucks', value: game.money.toFixed(3).toString() },
      { name: 'Percent Increase', value: game.percentIncrease.toString() },
      {
        name: 'Next Upgrade Cost',
        value: (await currentPrice(interaction.client, game)).toFixed(3).toString(),
      },
      { name: 'Idle Profit', value: game.profitRate.toFixed(3).toString() },
    )
    .setFooter({ text: 'Remember to vote for Semblance to gain a production boost!' });
  await interaction.update({ embeds: [embed], components });
}
