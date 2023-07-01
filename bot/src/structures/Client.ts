import { Collection } from '@discordjs/collection';
import Prisma from '@prisma/client';
import { FastifyBasedAPI } from './DiscordAPI.js';
import { LogLevel, type PreconditionName, isProduction, token, BotId, type GuildId } from '#constants/index';
import { WebhookLogger } from './WebhookLogger.js';
import { REST } from '@discordjs/rest';
import { WebSocketManager, WebSocketShardEvents } from '@discordjs/ws';
import { readdir } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import type { Command } from './Command.js';
import type { Listener } from './Listener.js';
import {
  type Snowflake,
  type APIGuild,
  GatewayDispatchEvents,
  GatewayIntentBits,
  Client as DiscordClient,
  type APIApplicationCommand,
  type APIUser,
  type APIUnavailableGuild,
  type APIChannel,
  type APIRole,
  type GatewayGuildCreateDispatchData,
  Routes,
} from '@discordjs/core';
import type { Precondition } from './Precondition.js';

export class Client {
  public cache = {
    data: {
      guilds: new Collection<Snowflake, (APIGuild & GatewayGuildCreateDispatchData) | APIUnavailableGuild>(),
      applicationCommands: new Collection<Snowflake, APIApplicationCommand>(),
      cellsChannels: new Collection<Snowflake, APIChannel>(),
      cellsRoles: new Collection<Snowflake, APIRole>(),
    },
    handles: {
      listeners: new Collection<GatewayDispatchEvents, Listener>(),
      commands: new Collection<Snowflake, Command>(),
      preconditions: new Collection<PreconditionName, Precondition>(),
    },
  };

  public rest = new REST({ version: '10' }).setToken(token);
  public logger = new WebhookLogger(this.rest, isProduction ? LogLevel.Info : LogLevel.Debug);
  public db = new Prisma.PrismaClient();

  public ws = new WebSocketManager({
    token,
    intents: GatewayIntentBits.Guilds,
    rest: this.rest,
  });
  public core = new DiscordClient({ rest: this.rest, gateway: this.ws });
  public api = new FastifyBasedAPI(this.rest);

  public user!: APIUser;
  public readyTimestamp!: number;

  async login() {
    await this.loadCommands();
    await this.loadPreconditions();
    await this.loadListeners();
    await this.ws.connect();
  }

  async loadCommands() {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const commandFiles = (
      await Promise.all(
        // read the commands folder, retrieving all of the command caegories(folders)
        (
          await readdir(pathToFileURL(join(__dirname, '..', 'commands')))
        ).map(async folder => {
          // read the command category folder, retrieving all of the command files
          const recursivelyCheckedfolders = await Promise.all(
            (
              await readdir(pathToFileURL(join(__dirname, '..', 'commands', folder)))
            ).map(async fileOrFolder => {
              // if the fileOrFolder is a folder, read the folder, retrieving all of the command files within the subcategory
              if (!fileOrFolder.includes('.'))
                return (await readdir(pathToFileURL(join(__dirname, '..', 'commands', folder, fileOrFolder))))
                  .filter(file => file.endsWith('.js'))
                  .map(file => join(folder, fileOrFolder, file));
              return fileOrFolder;
            }),
          );

          // join the command files with the command category folder and don't touch the subcategory folders
          // flatten the array of subcategory folders and command files
          return recursivelyCheckedfolders
            .filter(file => Array.isArray(file) || file.endsWith('.js'))
            .map(file => (Array.isArray(file) ? file : join(folder, file)))
            .flat();
        }),
      )
    ).flat();

    for (const file of commandFiles) {
      const command = new (await import(pathToFileURL(join(__dirname, '..', 'commands', file)).toString())).default(
        this,
      ) as Command;
      this.cache.handles.commands.set(command.name, command);
    }

    this.logger.info(`Loaded ${this.cache.handles.commands.size} commands.`);
  }

  async loadPreconditions() {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const preconditionFiles = (await readdir(pathToFileURL(join(__dirname, '..', 'preconditions')))).filter(file =>
      file.endsWith('.js'),
    );

    for (const file of preconditionFiles) {
      const precondition = new (
        await import(pathToFileURL(join(__dirname, '..', 'preconditions', file)).toString())
      ).default(this) as Precondition;
      this.cache.handles.preconditions.set(precondition.name as PreconditionName, precondition);
    }

    this.logger.info(`Loaded ${this.cache.handles.preconditions.size} preconditions.`);
  }

  async loadListeners() {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const listenerFiles = (await readdir(pathToFileURL(join(__dirname, '..', 'listeners')))).filter(file =>
      file.endsWith('.js'),
    );

    for (const file of listenerFiles) {
      const listener = new (await import(pathToFileURL(join(__dirname, '..', 'listeners', file)).toString())).default(
        this,
      ) as Listener;
      this.cache.handles.listeners.set(listener.event, listener);
    }

    this.logger.info(`Loaded ${this.cache.handles.listeners.size} listeners.`);

    this.ws.on(WebSocketShardEvents.Dispatch, ({ data }) => {
      switch (data.t) {
        case GatewayDispatchEvents.Ready:
          this.user = data.d.user;
          this.readyTimestamp = Date.now();
          this.cache.handles.listeners.get(data.t)?.run?.(data.d);
          break;
        case GatewayDispatchEvents.GuildCreate:
          this.cache.handles.listeners.get(data.t)?.run?.(data.d);
      }
    });
  }

  async deployCommands() {
    const applicationId = isProduction ? BotId.Production : BotId.Development;

    // may allow for global commands to be used in DMs, but for now, we'll just disable it
    const globalCommands = (
      await Promise.all(
        this.cache.handles.commands.filter(command => 'data' in command).map(async command => command.data?.()),
      )
    )
      .filter(data => !data?.guildIds)
      .map(command => ({ ...command?.command, dm_permission: false })) as APIApplicationCommand[];

    this.logger.info(`Deploying ${globalCommands.length} global commands...`);
    this.logger.info(globalCommands.map(command => command.name));

    await this.rest.put(Routes.applicationCommands(applicationId), {
      body: globalCommands,
    });

    const guildCommands = (
      await Promise.all(
        this.cache.handles.commands.filter(command => 'data' in command).map(async command => command.data?.()),
      )
    ).filter(data => data?.guildIds);

    this.logger.info(`Deploying ${guildCommands.length} guild commands...`);
    this.logger.info(guildCommands.map(command => command?.command.name));

    for (const guildId of guildCommands.map(command => command?.guildIds).flat()) {
      await this.rest.put(Routes.applicationGuildCommands(applicationId, guildId as string), {
        body: guildCommands
          .filter(command => command?.guildIds?.includes(guildId as GuildId))
          .map(command => ({ ...command?.command, dm_permission: false })) as APIApplicationCommand[],
      });
    }
  }
}
