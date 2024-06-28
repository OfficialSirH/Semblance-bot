import { Category, GuildId, msToTime } from '#constants/index';
import {
  APIPlayFabRoutes,
  APIPlayFabStatisticNames,
  pullPlayFabData,
  type GenericServiceId,
  type RESTPostAPIAddGenericIDJSONBody,
  type RESTPostAPIAddGenericIDResult,
  type RESTPostAPIGetPlayFabIDsFromGenericIDsJSONBody,
  type RESTPostAPIGetPlayFabIDsFromGenericIDsResult,
  type RESTPostAPIGetPlayFabPlayerProfileResult,
  type RESTPostAPIGetPlayFabPlayerStatisticsResult,
} from '#constants/playfab';
import { Command } from '#structures/Command';
import type { InteractionOptionResolver } from '#structures/InteractionOptionResolver';
import { EmbedBuilder } from '@discordjs/builders';
import {
  ApplicationCommandOptionType,
  MessageFlags,
  type APIChatInputApplicationCommandGuildInteraction,
  type RESTPostAPIApplicationCommandsJSONBody,
} from '@discordjs/core';
import type { FastifyReply } from 'fastify';

// NOTE: D5DF19CF5E15F25C for testing PlayFab ID

// TODO: rewrite this file to be for public use as a linker and allow users to preview progress on themselves or others

export default class GameConnectCommand extends Command {
  public constructor(client: Command.Requirement) {
    super(client, {
      name: 'game-connect',
      description: 'link discord to game account and get player stats',
      fullCategory: [Category.game],
    });
  }

  public override async chatInputRun(
    res: FastifyReply,
    interaction: APIChatInputApplicationCommandGuildInteraction,
    options: InteractionOptionResolver,
  ) {
    const subcommand = options.getSubcommand();

    switch (subcommand) {
      case 'preview-stats':
        await this.previewStats(res, interaction, options);
        break;
      case 'link':
        await this.link(res, interaction, options);
        break;
      default:
        return this.client.api.interactions.reply(res, {
          content: 'Invalid subcommand',
          flags: MessageFlags.Ephemeral,
        });
    }
  }

  public override data() {
    return {
      command: {
        name: this.name,
        description: this.description,
        options: [
          {
            name: 'preview-stats',
            description: "Preview a connected player's stats",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
              {
                name: 'user',
                description: 'discord user to preview stats of',
                type: ApplicationCommandOptionType.User,
                required: false,
              },
            ],
          },
          {
            name: 'link',
            description: 'Link your discord account to your PlayFab ID',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
              {
                name: 'playfab-id',
                description: 'PlayFab ID',
                type: ApplicationCommandOptionType.String,
                required: true,
              },
            ],
          },
        ],
      } satisfies RESTPostAPIApplicationCommandsJSONBody,
      guildIds: [GuildId.cellToSingularity],
    };
  }

  private async previewStats(
    res: FastifyReply,
    interactions: APIChatInputApplicationCommandGuildInteraction,
    options: InteractionOptionResolver,
  ) {
    const user = options.getUser('user', true);
    const genericId: GenericServiceId = {
      ServiceName: 'discord',
      UserId: user.id,
    };

    const genericIdPairs = await pullPlayFabData<
      RESTPostAPIGetPlayFabIDsFromGenericIDsResult,
      RESTPostAPIGetPlayFabIDsFromGenericIDsJSONBody
    >(APIPlayFabRoutes.GetPlayFabIDsFromGenericIDs, { GenericIDs: [genericId] });

    if (!genericIdPairs.ok) return this.client.api.interactions.reply(res, { content: genericIdPairs.message });
    const PlayFabId = genericIdPairs.value.data.Data[0].PlayFabId;
    if (!PlayFabId)
      return this.client.api.interactions.reply(res, { content: 'No PlayFab ID is linked to this discord account' });

    const playerProfile = await pullPlayFabData<RESTPostAPIGetPlayFabPlayerProfileResult>(
      APIPlayFabRoutes.GetPlayerProfile,
      { PlayFabId },
    );

    if (!playerProfile.ok) return this.client.api.interactions.reply(res, { content: playerProfile.message });

    const playerData = await pullPlayFabData<RESTPostAPIGetPlayFabPlayerStatisticsResult>(
      APIPlayFabRoutes.GetPlayerStatistics,
      { PlayFabId },
    );

    if (!playerData.ok) return this.client.api.interactions.reply(res, { content: playerData.message });

    const embed = this.createPlayerProfileInformationEmbed(playerProfile.value, playerData.value);
    return this.client.api.interactions.reply(res, { embeds: [embed] });
  }

  private async link(
    res: FastifyReply,
    interaction: APIChatInputApplicationCommandGuildInteraction,
    options: InteractionOptionResolver,
  ) {
    const PlayFabId = options.getString('playfab-id', true);

    const GenericId: GenericServiceId = {
      ServiceName: 'discord',
      UserId: interaction.member.user.id,
    };

    const addGenericId = await pullPlayFabData<RESTPostAPIAddGenericIDResult, RESTPostAPIAddGenericIDJSONBody>(
      APIPlayFabRoutes.AddGenericID,
      { PlayFabId, GenericId },
    );

    if (!addGenericId.ok) return this.client.api.interactions.reply(res, { content: addGenericId.message });

    return this.client.api.interactions.reply(res, {
      content: 'Successfully linked Discord account to PlayFab ID',
      flags: MessageFlags.Ephemeral,
    });
  }

  private createPlayerProfileInformationEmbed(
    playerProfile: RESTPostAPIGetPlayFabPlayerProfileResult,
    playerStatistics: RESTPostAPIGetPlayFabPlayerStatisticsResult,
  ) {
    const playerProfileData = playerProfile.data.PlayerProfile;
    const playerStatisticsData = playerStatistics.data.Statistics;

    const embed = new EmbedBuilder().setTitle('Player Stats').addFields([
      {
        name: 'Display Name',
        value: playerProfileData.DisplayName,
      },
    ]);

    const statisticsFields = playerStatisticsData
      .filter(
        stat =>
          ![
            APIPlayFabStatisticNames.IsBeta,
            APIPlayFabStatisticNames.Cheat,
            APIPlayFabStatisticNames.TierOverallNumeric,
            APIPlayFabStatisticNames.CurrentDarwinium,
          ].includes(stat.StatisticName),
      )
      .map(stat => {
        let name: string = stat.StatisticName;
        let value: string = stat.Value.toString();
        switch (name) {
          case APIPlayFabStatisticNames.IsBeta: {
            name = 'In Beta';
            value = stat.Value == 1 ? 'Yes' : 'No';
            break;
          }
          case APIPlayFabStatisticNames.Playtime: {
            name = 'Playtime';
            value = msToTime(stat.Value * 60 * 1000);
            break;
          }
          case APIPlayFabStatisticNames.Speedrun: {
            name = 'Speedrun Time';
            value = msToTime(stat.Value);
            break;
          }
          default: {
            if (name.startsWith('bdg_')) {
              const event = name.slice(4);
              name = event[0].toUpperCase() + event.slice(1);
              value = stat.Value.toString();
              // this will assume that all the badges will always be the same amount of digits as I don't know the true functionality of different badge counts
              let bronze: string, silver: string, gold: string;
              if (value.length === 5) [bronze, silver = '0', gold = '0'] = value.split('0');
              else {
                const badgeDigits = Math.floor(value.length / 3);
                bronze = value.slice(0, badgeDigits);
                silver = value.slice(badgeDigits, badgeDigits * 2);
                gold = value.slice(badgeDigits * 2);
              }
              value = `🥉 ${bronze} 🥈 ${silver} 🥇 ${gold}`;
              return { name, value, inline: true };
            }
          }
        }
        return { name, value, inline: true };
      });

    embed.addFields(statisticsFields);

    return embed.toJSON();
  }
}
