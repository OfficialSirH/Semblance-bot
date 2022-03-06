import { currentLogo, earlyBeyondTesters, roadMap } from '#config';
import { randomColor } from '#src/constants';
import { backButton, componentInteractionDefaultParser } from '#src/constants/components';
import { ActionRow, ButtonComponent, time, TimestampStyles } from '@discordjs/builders';
import { InteractionHandler, InteractionHandlerTypes, type PieceContext } from '@sapphire/framework';
import { type ButtonInteraction, Embed, ButtonStyle } from 'discord.js';

export default class Roadmap extends InteractionHandler {
  constructor(context: PieceContext) {
    super(context, { interactionHandlerType: InteractionHandlerTypes.Button });
  }

  public override async run(interaction: ButtonInteraction, action: string) {
    switch (action) {
      case 'early-beyond':
        await interaction.reply(earlyBeyond(interaction));
        break;
      case 'testers':
        await interaction.reply(testerCredits(interaction));
        break;
      case 'roadmap':
        await interaction.reply(roadmap(interaction));
        break;
      default:
        await interaction.reply({ content: 'An improper action was received.', ephemeral: true });
        break;
    }
  }

  public override async parse(interaction: ButtonInteraction) {
    return componentInteractionDefaultParser(this, interaction);
  }
}

function earlyBeyond(interaction: ButtonInteraction) {
  const embed = new Embed()
    .setTitle('Beyond Clips')
    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
    .setColor(randomColor)
    .setDescription(
      [
        `Fun Fact: The Beyond was mentioned 5203 times since ${time(
          1611959542848,
          TimestampStyles.LongDate,
        )} all the way till ${time(1635971517445, TimestampStyles.LongDate)}\n`,
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
    components: [new ActionRow().addComponents(backButton(this.name, interaction.user.id, 'roadmap'))],
  };
}

function testerCredits(interaction: ButtonInteraction) {
  const embed = new Embed()
    .setTitle('Credits to our Early Private Beta Testers!')
    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
    .setColor(randomColor)
    .setDescription(earlyBeyondTesters.join('\n'))
    .setFooter({
      text: 'Thank you Early Private Beta Testers for helping the ComputerLunch team with testing The Beyond! :D',
    });
  return {
    embeds: [embed],
    components: [new ActionRow().addComponents(backButton(this.name, interaction.user.id, 'roadmap'))],
  };
}

function roadmap(interaction: ButtonInteraction) {
  const embed = new Embed()
    .setTitle('Road Map')
    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
    .setColor(randomColor)
    .setThumbnail(currentLogo.name)
    .setImage(roadMap.name);
  const components = [
    new ActionRow().addComponents(
      new ButtonComponent()
        .setCustomId(
          JSON.stringify({
            command: 'roadmap',
            action: 'testers',
          }),
        )
        .setStyle(ButtonStyle.Primary)
        .setLabel('Early Beyond Testers'),
      new ButtonComponent()
        .setCustomId(
          JSON.stringify({
            command: 'roadmap',
            action: 'early-beyond',
          }),
        )
        .setStyle(ButtonStyle.Primary)
        .setLabel('Early Beyond Sneak Peeks'),
    ),
  ];
  return { embeds: [embed], files: [currentLogo, roadMap], components };
}
