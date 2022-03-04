import {
  ActionRow,
  ApplicationCommandOptionType,
  ButtonComponent,
  ButtonStyle,
  type ChatInputCommandInteraction,
  Embed,
  type InteractionReplyOptions,
  type ReplyMessageOptions,
} from 'discord.js';
import type { Message, GuildMember } from 'discord.js';
import { rpsGames } from '#src/interaction-handlers/componentHandlers/rps';
import { Categories, randomColor } from '#constants/index';
import { choiceToOutcome, countdownGIF, randomChoice } from '#constants/commands';
import { Command } from '@sapphire/framework';
import type { ApplicationCommandRegistry, Args } from '@sapphire/framework';
import type { RPSCommandArgs } from 'rps';
import { defaultEmojiToUsableEmoji } from '#src/constants/components';
import type { MessageOptions } from 'child_process';

export default class Rps extends Command {
  public override name = 'rps';
  public override description = 'Play rock paper scissors';
  public override fullCategory = [Categories.fun];

  public async rpsSharedRun<T extends Command['SharedBuilder']>(
    builder: T,
    args: RPSCommandArgs,
  ): Promise<string | (T extends Message ? MessageOptions | ReplyMessageOptions : InteractionReplyOptions)> {
    const user = 'user' in builder ? builder.user : builder.author;

    if (rpsGames.has(user.id))
      return {
        content: 'You have an RPS game still running, please finish your previous game first',
        ephemeral: true,
      };

    if (args.opponent?.guild?.id != builder.guild.id)
      return {
        content: "The opponent you choose isn't a part of this guild (or the command just wanted to have an issue).",
        ephemeral: true,
      };

    if (args.opponent?.id == user.id)
      return {
        content: "Are you this lonely that you chose to face yourself? I'm sorry, but that's not how this game works.",
        ephemeral: true,
      };
    if (user.bot && user.id != builder.client.user.id)
      return `You can't face a bot (except for me) so what are you doing trying to fight ${args.opponent?.user?.tag}?`;

    const components = [
        new ActionRow().addComponents(
          new ButtonComponent()
            .setLabel('Rock')
            .setCustomId(
              JSON.stringify({
                command: 'rps',
                action: 'rock',
                id: user.id,
              }),
            )
            .setEmoji(defaultEmojiToUsableEmoji('🪨'))
            .setStyle(ButtonStyle.Secondary),
          new ButtonComponent()
            .setLabel('Paper')
            .setCustomId(
              JSON.stringify({
                command: 'rps',
                action: 'paper',
                id: user.id,
              }),
            )
            .setEmoji(defaultEmojiToUsableEmoji('📄'))
            .setStyle(ButtonStyle.Secondary),
          new ButtonComponent()
            .setLabel('Scissors')
            .setCustomId(
              JSON.stringify({
                command: 'rps',
                action: 'scissors',
                id: user.id,
              }),
            )
            .setEmoji(defaultEmojiToUsableEmoji('✂'))
            .setStyle(ButtonStyle.Secondary),
          new ButtonComponent()
            .setLabel('Lizard')
            .setCustomId(
              JSON.stringify({
                command: 'rps',
                action: 'lizard',
                id: user.id,
              }),
            )
            .setEmoji(defaultEmojiToUsableEmoji('🦎'))
            .setStyle(ButtonStyle.Secondary),
          new ButtonComponent()
            .setLabel('Spock')
            .setCustomId(
              JSON.stringify({
                command: 'rps',
                action: 'spock',
                id: user.id,
              }),
            )
            .setEmoji(defaultEmojiToUsableEmoji('👽'))
            .setStyle(ButtonStyle.Secondary),
        ),
      ],
      embed = new Embed()
        .setTitle(`${user.tag} has challenged ${args.opponent?.user?.tag} to Rock, Paper, Scissors, Lizard, Spock!`)
        .setThumbnail(countdownGIF)
        .setColor(randomColor)
        .setDescription('Make your choice with one of the buttons below.');
    const awaitingText = args.choice
        ? `Awaiting for **${args.opponent?.user?.tag}**`
        : `Awaiting for **${user.tag}** and **${args.opponent?.user?.tag}**`,
      semblanceChoice = randomChoice();

    let rpsMessage: Message;
    const isInteractionRps = 'fetchReply' in builder;

    if (args.opponent.id == builder.client.user.id) {
      if (args.choice) {
        let endTemplate = `${user.tag} chose ${args.choice} and ${builder.client.user.tag} chose ${semblanceChoice}, leading to `;
        const playerVictory = choiceToOutcome(args.choice, semblanceChoice);

        if (playerVictory == 'tie')
          endTemplate = `${user.tag} and ${builder.client.user.tag} both chose ${args.choice} so it's a tie!`;
        else if (playerVictory) endTemplate += `${user.tag}'s victory!`;
        else endTemplate += `${builder.client.user.tag}'s victory!`;

        return endTemplate;
      } else
        await builder
          .reply({
            content: `Awaiting for **${user.tag}**`,
            embeds: [embed],
            components,
          })
          .then(() => (!isInteractionRps ? (rpsMessage = builder) : null));
    } else
      await builder
        .reply({
          content: awaitingText,
          embeds: [embed],
          components,
        })
        .then(() => (!isInteractionRps ? (rpsMessage = builder) : null));

    rpsMessage = isInteractionRps ? await builder.fetchReply() : rpsMessage;

    rpsGames.set(user.id, {
      player: {
        id: user.id,
        tag: user.tag,
        choice: args.choice || '',
      },
      opponent: {
        id: args.opponent?.id,
        tag: args.opponent?.user?.tag,
        choice: args.opponent.id == builder.client.user.id ? semblanceChoice : '',
      },
      timeout: setTimeout(async () => {
        if (rpsGames.has(user.id))
          await rpsMessage.edit({
            content: null,
            embeds: [
              rpsMessage.embeds[0]
                .setTitle('RPS game has timed out')
                .setDescription('Someone took too long to make a choice. :('),
            ],
            components: [],
          });
        rpsGames.delete(user.id);
      }, 60000).unref(),
    });
  }

  public override async messageRun(message: Message, args: Args) {
    const choice = await args.pickResult('string');
    const opponent = await args.pickResult('member');
    const mappedArgs: RPSCommandArgs = {};

    if (choice.success) mappedArgs['choice'] = choice.value;
    if (opponent.success) mappedArgs['opponent'] = opponent.value;

    await message.reply((await this.rpsSharedRun(message, mappedArgs)) as ReplyMessageOptions);
  }

  public override async chatInputRun(interaction: ChatInputCommandInteraction<'cached'>) {
    const choice = interaction.options.getString('choice');
    const opponent: GuildMember = await interaction.guild.members
      .fetch(interaction.options.getUser('opponent').id)
      .catch(() => null);
    const mappedArgs: RPSCommandArgs = {};

    if (choice) mappedArgs['choice'] = choice;
    if (opponent) mappedArgs['opponent'] = opponent;

    await interaction.reply(await this.rpsSharedRun(interaction, mappedArgs));
  }

  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand({
      name: this.name,
      description: this.description,
      options: [
        {
          name: 'choice',
          description: 'The choice you want to use against your opponent',
          type: ApplicationCommandOptionType.String,
          required: false,
        },
        {
          name: 'opponent',
          description: 'Who you want to go against',
          type: ApplicationCommandOptionType.User,
          required: false,
        },
      ],
    });
  }
}
