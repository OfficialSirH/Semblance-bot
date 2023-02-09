import { Collection } from '@discordjs/collection';
import Prisma from '@prisma/client';
import { FastifyBasedAPI } from './DiscordAPI';
import { LogLevel, type PreconditionName, isProduction, token, BotId, type GuildId } from '#constants/index';
import { WebhookLogger } from './WebhookLogger';
import { REST } from '@discordjs/rest';
import { WebSocketManager, WebSocketShardEvents } from '@discordjs/ws';
import { readdir } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import type { Command } from './Command';
import type { Listener } from './Listener';
import {
  type Snowflake,
  type APIGuild,
  GatewayDispatchEvents,
  GatewayIntentBits,
  createClient,
  type APIApplicationCommand,
  type APIUser,
  type APIUnavailableGuild,
  type APIChannel,
  type APIRole,
  type GatewayGuildCreateDispatchData,
  Routes,
} from '@discordjs/core';
import type { Precondition } from './Precondition';

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
  public core = createClient({ rest: this.rest, ws: this.ws });
  public api = new FastifyBasedAPI(this.rest);

  public user!: APIUser;
  public readyTimestamp!: number;

  async login() {
    await this.loadCommands();
    await this.loadListeners();
    await this.ws.connect();
  }

  async loadCommands() {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const commandFiles = (await readdir(join(__dirname, '..', 'commands'))).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const command = new (await import(join(__dirname, '..', 'commands', file))).default(this) as Command;
      this.cache.handles.commands.set(command.name, command);
    }
  }

  async loadPreconditions() {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const preconditionFiles = (await readdir(join(__dirname, '..', 'preconditions'))).filter(file =>
      file.endsWith('.js'),
    );

    for (const file of preconditionFiles) {
      const precondition = new (await import(join(__dirname, '..', 'preconditions', file))).default(
        this,
      ) as Precondition;
      this.cache.handles.preconditions.set(precondition.name as PreconditionName, precondition);
    }
  }

  async loadListeners() {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const listenerFiles = (await readdir(join(__dirname, '..', 'listeners'))).filter(file => file.endsWith('.js'));

    for (const file of listenerFiles) {
      const listener = new (await import(join(__dirname, '..', 'listeners', file))).default(this) as Listener;
      this.cache.handles.listeners.set(listener.event, listener);
    }

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
        this.cache.handles.commands
          .filter(async command => !(await command.data?.())?.guildIds)
          .map(async command => command.data?.()),
      )
    ).map(command => ({ ...command, dm_permission: false })) as APIApplicationCommand[];

    await this.rest.put(Routes.applicationCommands(applicationId), {
      body: globalCommands,
    });

    const guildCommands = await Promise.all(
      this.cache.handles.commands
        .filter(async command => (await command.data?.())?.guildIds)
        .map(async command => command.data?.()),
    );

    for (const guildId of guildCommands.map(command => command?.guildIds).flat()) {
      await this.rest.put(Routes.applicationGuildCommands(applicationId, guildId as string), {
        body: guildCommands.filter(command => command?.guildIds?.includes(guildId as GuildId)),
      });
    }
  }
}
