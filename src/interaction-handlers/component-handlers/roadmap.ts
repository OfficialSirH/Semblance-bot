import { randomColor, attachments, earlyBeyondTesters } from '#constants/index';
import { backButton, buildCustomId, componentInteractionDefaultParser } from '#constants/components';
import { InteractionHandler, InteractionHandlerTypes, type PieceContext } from '@sapphire/framework';
import {
  type MessageActionRowComponentBuilder,
  type ButtonInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from 'discord.js';
import type { ParsedCustomIdData } from '#lib/interfaces/Semblance';

export default class Roadmap extends InteractionHandler {
  constructor(context: PieceContext) {
    super(context, { interactionHandlerType: InteractionHandlerTypes.Button });
  }

  public override async parse(interaction: ButtonInteraction): ReturnType<typeof componentInteractionDefaultParser> {
    return componentInteractionDefaultParser(this, interaction);
  }

  public override async run(
    interaction: ButtonInteraction,
    data: ParsedCustomIdData<'early-beyond' | 'testers' | 'roadmap'>,
  ) {
    switch (data.action) {
      case 'early-beyond':
        await interaction.update(earlyBeyond(interaction, this.name));
        break;
      case 'testers':
        await interaction.update(testerCredits(interaction, this.name));
        break;
      case 'roadmap':
        await interaction.update(roadmap(interaction));
        break;
      default:
        await interaction.reply({ content: 'An improper action was received.', ephemeral: true });
        break;
    }
  }
}

function earlyBeyond(interaction: ButtonInteraction, name: string) {
  const embed = new EmbedBuilder()
    .setTitle('Beyond Clips')
    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
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
    embeds: [embed],
    components: [
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        backButton(name, interaction.user.id, 'roadmap'),
      ),
    ],
    files: [],
  };
}

function testerCredits(interaction: ButtonInteraction, name: string) {
  const embed = new EmbedBuilder()
    .setTitle('Credits to our Early Private Beta Testers!')
    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
    .setColor(randomColor)
    .setDescription(earlyBeyondTesters.map(e => `<@${e}>`).join('\n'))
    .setFooter({
      text: 'Thank you Early Private Beta Testers for helping the ComputerLunch team with testing The Beyond! :D',
    });
  return {
    embeds: [embed],
    components: [
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        backButton(name, interaction.user.id, 'roadmap'),
      ),
    ],
    files: [],
  };
}

function roadmap(interaction: ButtonInteraction) {
  const embed = new EmbedBuilder()
    .setTitle('Road Map')
    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
    .setColor(randomColor)
    .setThumbnail(attachments.currentLogo.name)
    .setImage(attachments.roadMap.name);
  const components = [
    new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(
          buildCustomId({
            command: 'roadmap',
            action: 'testers',
            id: interaction.user.id,
          }),
        )
        .setStyle(ButtonStyle.Primary)
        .setLabel('Early Beyond Testers'),
      new ButtonBuilder()
        .setCustomId(
          buildCustomId({
            command: 'roadmap',
            action: 'early-beyond',
            id: interaction.user.id,
          }),
        )
        .setStyle(ButtonStyle.Primary)
        .setLabel('Early Beyond Sneak Peeks'),
    ),
  ];
  return { embeds: [embed], files: [attachments.currentLogo.attachment, attachments.roadMap.attachment], components };
}
