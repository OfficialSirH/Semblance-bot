import { MessageEmbed, Collection, Permissions, MessageActionRow, MessageButton } from 'discord.js';
import type { Message } from 'discord.js';
import { randomColor } from '#constants/index';
import type { Command } from '#lib/interfaces/Semblance';
import { currentPrice } from '#constants/commands';
import type { Semblance } from '#src/structures/Semblance';
const cooldownHandler: Collection<string, number> = new Collection();

export default {
  description: 'An idle-game within Semblance',
  category: 'fun',
  usage: {
    '<help, create, collect, upgrade, leaderboard>': '',
  },
  permissionRequired: 0,
  checkArgs: () => true,
  run: (client, message) => run(client, message),
} as Command<'fun'>;

const run = async (client: Semblance, message: Message) => {
  if (!cooldownHandler.get(message.author.id) && !message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))
    cooldownHandler.set(message.author.id, Date.now());
  else if ((Date.now() - cooldownHandler.get(message.author.id)) / 1000 < 5) {
    return message.reply(
      `You can't use the game command for another ${
        (Date.now() - cooldownHandler.get(message.author.id)) / 1000
      } seconds.`,
    );
  } else if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
    cooldownHandler.set(message.author.id, Date.now());
  }

  const statsHandler = await client.db.game.findUnique({ where: { player: message.author.id } }),
    embed = new MessageEmbed();
  let cost: number;
  if (!statsHandler)
    embed
      .setTitle("Semblance's Idle-Game")
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
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
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setColor(randomColor)
      .setThumbnail(message.author.displayAvatarURL())
      .addFields([
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
      ])
      .setFooter({ text: 'Remember to vote for Semblance to gain a production boost!' }),
      (cost = await currentPrice(client, statsHandler));

  const components = [
    new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId(
          JSON.stringify({
            command: 'game',
            action: 'about',
            id: message.author.id,
          }),
        )
        .setStyle('PRIMARY')
        .setEmoji('❔')
        .setLabel('About'),
      new MessageButton()
        .setCustomId(
          JSON.stringify({
            command: 'game',
            action: 'collect',
            id: message.author.id,
          }),
        )
        .setDisabled(!statsHandler)
        .setStyle('PRIMARY')
        .setEmoji('💵')
        .setLabel('Collect'),
      new MessageButton()
        .setCustomId(
          JSON.stringify({
            command: 'game',
            action: 'upgrade',
            id: message.author.id,
          }),
        )
        .setDisabled(!statsHandler || statsHandler.money < cost)
        .setStyle('PRIMARY')
        .setEmoji('⬆')
        .setLabel('Upgrade'),
      new MessageButton()
        .setCustomId(
          JSON.stringify({
            command: 'game',
            action: 'leaderboard',
            id: message.author.id,
          }),
        )
        .setStyle('PRIMARY')
        .setEmoji('🏅')
        .setLabel('Leaderboard'),
      new MessageButton()
        .setCustomId(
          JSON.stringify({
            command: 'game',
            action: 'vote',
            id: message.author.id,
          }),
        )
        .setStyle('PRIMARY')
        .setEmoji('💰')
        .setLabel('Voting Sites'),
    ),
  ];

  return message.channel.send({
    content: "note: There's a slash command for this now, if your Discord client allows it, you can use /game",
    embeds: [embed],
    components,
  });
};
