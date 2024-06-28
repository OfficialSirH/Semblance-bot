import { Category, GuildId, msToTime, PreconditionName } from '#constants/index';
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
  type APIChatInputApplicationCommandGuildInteraction,
  type RESTPostAPIApplicationCommandsJSONBody,
} from '@discordjs/core';
import type { FastifyReply } from 'fastify';

// NOTE: D5DF19CF5E15F25C for testing PlayFab ID

export default class PlayFabShowcase extends Command {
  public constructor(client: Command.Requirement) {
    super(client, {
      name: 'playfab-showcase',
      description: 'showcase for possible playfab integrations',
      fullCategory: [Category.developer],
      preconditions: [PreconditionName.OwnerOnly],
    });
  }

  public override async chatInputRun(
    res: FastifyReply,
    interaction: APIChatInputApplicationCommandGuildInteraction,
    options: InteractionOptionResolver,
  ) {
    const subcommand = options.getSubcommand();

    switch (subcommand) {
      case 'get-player':
        await this.getPlayerFromPlayFab(res, interaction, options);
        break;
      case 'get-player-by-user':
        await this.getPlayerByUser(res, interaction, options);
        break;
      case 'add-discord-connection':
        await this.addDiscordConnection(res, interaction, options);
        break;
      default:
        return this.client.api.interactions.reply(res, { content: 'Invalid subcommand' });
    }
  }

  public override data() {
    return {
      command: {
        name: this.name,
        description: this.description,
        options: [
          {
            name: 'get-player',
            description: 'Get a player from PlayFab',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
              {
                name: 'player-id',
                description: 'PlayFab ID',
                type: ApplicationCommandOptionType.String,
                required: true,
              },
            ],
          },
          {
            name: 'get-player-by-user',
            description: 'Get a player from PlayFab via Discord User or ID',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
              {
                name: 'user',
                description: 'discord user to get PlayFab player from',
                type: ApplicationCommandOptionType.User,
                required: true,
              },
            ],
          },
          {
            name: 'add-discord-connection',
            description: 'Add a Discord connection to a PlayFab player',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
              {
                name: 'playfab-id',
                description: 'PlayFab ID',
                type: ApplicationCommandOptionType.String,
                required: true,
              },
              {
                name: 'user',
                description: 'Discord user to connect to PlayFab ID',
                type: ApplicationCommandOptionType.User,
                required: true,
              },
            ],
          },
        ],
      } satisfies RESTPostAPIApplicationCommandsJSONBody,
      guildIds: [GuildId.cellToSingularity],
    };
  }

  private async getPlayerFromPlayFab(
    res: FastifyReply,
    interactions: APIChatInputApplicationCommandGuildInteraction,
    options: InteractionOptionResolver,
  ) {
    const PlayFabId = options.getString('player-id', true);

    console.log('playfab id:', PlayFabId);

    const playerProfile = await pullPlayFabData<RESTPostAPIGetPlayFabPlayerProfileResult>(
      APIPlayFabRoutes.GetPlayerProfile,
      { PlayFabId },
    );

    console.log('player profile:', playerProfile);

    if (!playerProfile.ok) return this.client.api.interactions.reply(res, { content: playerProfile.message });

    const playerData = await pullPlayFabData<RESTPostAPIGetPlayFabPlayerStatisticsResult>(
      APIPlayFabRoutes.GetPlayerStatistics,
      { PlayFabId },
    );

    console.log('player data:', playerData);

    if (!playerData.ok) return this.client.api.interactions.reply(res, { content: playerData.message });

    const embed = this.createPlayerProfileInformationEmbed(playerProfile.value, playerData.value);
    return this.client.api.interactions.reply(res, { embeds: [embed] });
  }

  private async getPlayerByUser(
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

    console.log('generic id pairs:', genericIdPairs);

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

  private async addDiscordConnection(
    res: FastifyReply,
    interactions: APIChatInputApplicationCommandGuildInteraction,
    options: InteractionOptionResolver,
  ) {
    const PlayFabId = options.getString('playfab-id', true);
    const user = options.getUser('user', true);

    const GenericId: GenericServiceId = {
      ServiceName: 'discord',
      UserId: user.id,
    };

    const addGenericId = await pullPlayFabData<RESTPostAPIAddGenericIDResult, RESTPostAPIAddGenericIDJSONBody>(
      APIPlayFabRoutes.AddGenericID,
      { PlayFabId, GenericId },
    );

    if (!addGenericId.ok) return this.client.api.interactions.reply(res, { content: addGenericId.message });

    return this.client.api.interactions.reply(res, { content: 'Successfully linked Discord account to PlayFab ID' });
  }

  private createPlayerProfileInformationEmbed(
    playerProfile: RESTPostAPIGetPlayFabPlayerProfileResult,
    playerStatistics: RESTPostAPIGetPlayFabPlayerStatisticsResult,
  ) {
    const playerProfileData = playerProfile.data.PlayerProfile;
    const playerStatisticsData = playerStatistics.data.Statistics;

    const embed = new EmbedBuilder()
      .setTitle('Player Stats')
      //   .setDescription(`**Player ID:** ${playerProfileData.PlayerId}\n
      // **Display Name:** ${playerProfileData.DisplayName}`);
      .addFields([
        {
          name: 'Player ID',
          value: playerProfileData.PlayerId,
        },
        {
          name: 'Display Name',
          value: playerProfileData.DisplayName,
        },
      ]);

    console.log('statistics:', playerStatisticsData.length);

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
        console.log('stat:', stat.StatisticName);
        let name: string = stat.StatisticName;
        let value: string = stat.Value.toString();
        switch (name) {
          // case APIPlayFabStatisticNames.IsBeta: {
          //   name = 'Is Beta';
          //   value = stat.Value == 1 ? 'Yes' : 'No';
          //   break;
          // }
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
              name = name.slice(4).toLocaleUpperCase();
              value = stat.Value.toString();
              // this will assume that all the badges will always be the same amount of digits as I don't know the true functionality of different badge counts
              let bronze: string, silver: string, gold: string;
              if (value.length === 5) [bronze, silver = '0', gold = '0'] = value.split('0');
              else {
                console.log('badge digits will be checked');
                const badgeDigits = Math.floor(value.length / 3);
                console.log('badge digits:', badgeDigits);
                bronze = value.slice(0, badgeDigits);
                silver = value.slice(badgeDigits, badgeDigits * 2);
                gold = value.slice(badgeDigits * 2);
              }
              value = `🥉 ${bronze} 🥈 ${silver} 🥇 ${gold}`;
              console.log('badge values:', bronze, silver, gold);
              return { name, value, inline: true };
            }
          }
        }
        return { name, value, inline: true };
      });

    console.log('we are here, hopefully: ' + statisticsFields.length);

    embed.addFields(statisticsFields);

    console.log('embed:', embed.toJSON());

    return embed.toJSON();
  }
}
