import { Category, randomColor, SubCategory, attachments, earlyBeyondTesters } from '#constants/index';
import { Command } from '#structures/Command';
import { backButton, buildCustomId } from '#constants/components';
import {
  ButtonStyle,
  type APIChatInputApplicationCommandGuildInteraction,
  MessageFlags,
  type APIMessageComponentButtonInteraction,
} from '@discordjs/core';
import type { FastifyReply } from 'fastify';
import {
  EmbedBuilder,
  ActionRowBuilder,
  type MessageActionRowComponentBuilder,
  ButtonBuilder,
} from '@discordjs/builders';
import type { ParsedCustomIdData } from '#lib/interfaces/Semblance';

export default class Roadmap extends Command {
  public constructor(client: Command.Requirement) {
    super(client, {
      name: 'roadmap',
      description: 'details on the C2S Roadmap',
      fullCategory: [Category.game, SubCategory.other],
    });
  }

  public override async chatInputRun(res: FastifyReply, interaction: APIChatInputApplicationCommandGuildInteraction) {
    await this.client.api.interactions.reply(res, this.templateRun(interaction));
  }

  public override templateRun(interaction: APIChatInputApplicationCommandGuildInteraction) {
    const embed = new EmbedBuilder()
      .setTitle('Road Map')
      .setColor(randomColor)
      .setThumbnail(attachments.currentLogo.url)
      .setImage(attachments.roadMap.url);
    const components = [
      new ActionRowBuilder<MessageActionRowComponentBuilder>()
        .addComponents(
          new ButtonBuilder()
            .setCustomId(
              buildCustomId({
                command: 'roadmap',
                action: 'testers',
                id: interaction.member.user.id,
              }),
            )
            .setStyle(ButtonStyle.Primary)
            .setLabel('Early Beyond Testers'),
          new ButtonBuilder()
            .setCustomId(
              buildCustomId({
                command: 'roadmap',
                action: 'early-beyond',
                id: interaction.member.user.id,
              }),
            )
            .setStyle(ButtonStyle.Primary)
            .setLabel('Early Beyond Sneak Peeks'),
        )
        .toJSON(),
    ];
    return {
      embeds: [embed.toJSON()],
      files: [attachments.currentLogo, attachments.roadMap],
      components,
    };
  }

  public override data() {
    return {
      command: { name: this.name, description: this.description },
    };
  }

  public override async componentRun(
    reply: FastifyReply,
    interaction: APIMessageComponentButtonInteraction,
    data: ParsedCustomIdData<'early-beyond' | 'testers' | 'roadmap'>,
  ) {
    switch (data.action) {
      case 'early-beyond':
        await this.client.api.interactions.updateMessage(reply, earlyBeyond(interaction, this.name));
        break;
      case 'testers':
        await this.client.api.interactions.updateMessage(reply, testerCredits(interaction, this.name));
        break;
      case 'roadmap':
        await this.client.api.interactions.updateMessage(reply, roadmap(interaction));
        break;
      default:
        await this.client.api.interactions.reply(reply, {
          content: 'An improper action was received.',
          flags: MessageFlags.Ephemeral,
        });
        break;
    }
  }
}

function earlyBeyond(interaction: APIMessageComponentButtonInteraction, name: string) {
  const embed = new EmbedBuilder()
    .setTitle('Beyond Clips')

    .setColor(randomColor)
    .setDescription(
      [
        `Fun Fact: The Beyond was mentioned 5203 times since <t:${1611959542848}:F> all the way till <t:${1635971517445}:F>\n`,
        '[Clip One](https://clips.twitch.tv/CharmingVibrantWatermelonPeoplesChamp)',
        '[Clip Two](https://clips.twitch.tv/GracefulSmellyYakDoggo)',
        '[Clip Three](https://clips.twitch.tv/BillowingCovertFishFeelsBadMan)',
        '[Clip Four](https://clips.twitch.tv/NurturingMushyClintmullinsDuDudu)',
        '[Clip Five](https://clips.twitch.tv/MistyAgileWrenLitFam)',
        '[Clip Six](https://clips.twitch.tv/AffluentDoubtfulPeachDendiFace)',
        '[Clip Seven](https://clips.twitch.tv/CarefulUnusualDootResidentSleeper)',
        '[Clip Eight](https://clips.twitch.tv/AbstemiousCreativeChoughJKanStyle)',
        '[Clip Nine](https://clips.twitch.tv/WrongGiftedBeefThisIsSparta-wCREhZ-Q_OnJIs24)',
        '[Clip Ten](https://clips.twitch.tv/JoyousCarefulCheesePMSTwin-QbCPmpwO_taQfUTe)',
        '[Clip Eleven](https://clips.twitch.tv/ConfidentTallAniseSpicyBoy-zSeEcUibWET5R4pc)',
      ].join('\n'),
    );
  return {
    embeds: [embed.toJSON()],
    components: [
      new ActionRowBuilder<MessageActionRowComponentBuilder>()
        .addComponents(backButton(name, interaction.member?.user.id as string, 'roadmap'))
        .toJSON(),
    ],
    files: [],
  };
}

function testerCredits(interaction: APIMessageComponentButtonInteraction, name: string) {
  const embed = new EmbedBuilder()
    .setTitle('Credits to our Early Private Beta Testers!')

    .setColor(randomColor)
    .setDescription(earlyBeyondTesters.map(e => `<@${e}>`).join('\n'))
    .setFooter({
      text: 'Thank you Early Private Beta Testers for helping the ComputerLunch team with testing The Beyond! :D',
    });
  return {
    embeds: [embed.toJSON()],
    components: [
      new ActionRowBuilder<MessageActionRowComponentBuilder>()
        .addComponents(backButton(name, interaction.member?.user.id as string, 'roadmap'))
        .toJSON(),
    ],
    files: [],
  };
}

function roadmap(interaction: APIMessageComponentButtonInteraction) {
  const userId = interaction.member?.user.id as string;

  const embed = new EmbedBuilder()
    .setTitle('Road Map')
    .setColor(randomColor)
    .setThumbnail(attachments.currentLogo.url)
    .setImage(attachments.roadMap.url);
  const components = [
    new ActionRowBuilder<MessageActionRowComponentBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(
            buildCustomId({
              command: 'roadmap',
              action: 'testers',
              id: userId,
            }),
          )
          .setStyle(ButtonStyle.Primary)
          .setLabel('Early Beyond Testers'),
        new ButtonBuilder()
          .setCustomId(
            buildCustomId({
              command: 'roadmap',
              action: 'early-beyond',
              id: userId,
            }),
          )
          .setStyle(ButtonStyle.Primary)
          .setLabel('Early Beyond Sneak Peeks'),
      )
      .toJSON(),
  ];
  return {
    embeds: [embed.toJSON()],
    files: [attachments.currentLogo, attachments.roadMap],
    components,
  };
}
