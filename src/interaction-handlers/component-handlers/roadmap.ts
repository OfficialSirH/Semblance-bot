import { currentLogo, earlyBeyondTesters, roadMap } from '#config';
import { randomColor } from '#constants/index';
import { backButton, buildCustomId, componentInteractionDefaultParser } from '#constants/components';
import { MessageActionRow, MessageButton } from 'discord.js';
import { InteractionHandler, InteractionHandlerTypes, type PieceContext } from '@sapphire/framework';
import { type ButtonInteraction, MessageEmbed } from 'discord.js';
import type { ParsedCustomIdData } from 'Semblance';

export default class Roadmap extends InteractionHandler {
  constructor(context: PieceContext) {
    super(context, { interactionHandlerType: InteractionHandlerTypes.Button });
  }

  public override async parse(interaction: ButtonInteraction) {
    return componentInteractionDefaultParser(this, interaction);
  }

  public override async run(
    interaction: ButtonInteraction,
    data: ParsedCustomIdData<'early-beyond' | 'testers' | 'roadmap'>,
  ) {
    switch (data.action) {
      case 'early-beyond':
        await interaction.channel.messages.edit(interaction.message.id, earlyBeyond(interaction, this.name));
        break;
      case 'testers':
        await interaction.channel.messages.edit(interaction.message.id, testerCredits(interaction, this.name));
        break;
      case 'roadmap':
        await interaction.channel.messages.edit(interaction.message.id, roadmap(interaction));
        break;
      default:
        await interaction.reply({ content: 'An improper action was received.', ephemeral: true });
        break;
    }
  }
}

function earlyBeyond(interaction: ButtonInteraction, name: string) {
  const embed = new MessageEmbed()
    .setTitle('Beyond Clips')
    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
    .setColor(randomColor)
    .setDescription(
      [
        `Fun Fact: The Beyond was mentioned 5203 times since <:F:${1611959542848}> all the way till <:F:${1635971517445}>\n`,
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
    components: [new MessageActionRow().addComponents(backButton(name, interaction.user.id, 'roadmap'))],
  };
}

function testerCredits(interaction: ButtonInteraction, name: string) {
  const embed = new MessageEmbed()
    .setTitle('Credits to our Early Private Beta Testers!')
    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
    .setColor(randomColor)
    .setDescription(earlyBeyondTesters.join('\n'))
    .setFooter({
      text: 'Thank you Early Private Beta Testers for helping the ComputerLunch team with testing The Beyond! :D',
    });
  return {
    embeds: [embed],
    components: [new MessageActionRow().addComponents(backButton(name, interaction.user.id, 'roadmap'))],
  };
}

function roadmap(interaction: ButtonInteraction) {
  const embed = new MessageEmbed()
    .setTitle('Road Map')
    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
    .setColor(randomColor)
    .setThumbnail(currentLogo.name)
    .setImage(roadMap.name);
  const components = [
    new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId(
          buildCustomId({
            command: 'roadmap',
            action: 'testers',
            id: interaction.user.id,
          }),
        )
        .setStyle('PRIMARY')
        .setLabel('Early Beyond Testers'),
      new MessageButton()
        .setCustomId(
          buildCustomId({
            command: 'roadmap',
            action: 'early-beyond',
            id: interaction.user.id,
          }),
        )
        .setStyle('PRIMARY')
        .setLabel('Early Beyond Sneak Peeks'),
    ),
  ];
  return { embeds: [embed], files: [currentLogo, roadMap], components };
}
