import { Collection } from '@discordjs/collection';
import Prisma from '@prisma/client';
import { FastifyBasedAPI } from './DiscordAPI';
import { LogLevel, isProduction, token } from '#constants/index';
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
} from '@discordjs/core';

export class Client {
  public cache = {
    data: {
      guilds: new Collection<Snowflake, APIGuild>(),
      applicationCommands: new Collection<Snowflake, APIApplicationCommand>(),
    },
    handles: {
      listeners: new Collection<GatewayDispatchEvents, Listener>(),
      commands: new Collection<Snowflake, Command>(),
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

  public user?: APIUser;

  async login() {
    await this.loadCommands();
    await this.loadListeners();
    await this.ws.connect();
  }

  async loadCommands() {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const commandFiles = (await readdir(join(__dirname, 'commands'))).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const command = new (await import(join(__dirname, 'commands', file))).default(this) as Command;
      this.cache.handles.commands.set(command.name, command);
    }
  }

  async loadListeners() {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const listenerFiles = (await readdir(join(__dirname, 'listeners'))).filter(file => file.endsWith('.js'));

    for (const file of listenerFiles) {
      const listener = new (await import(join(__dirname, 'listeners', file))).default(this) as Listener;
      this.cache.handles.listeners.set(listener.event, listener);
    }

    this.ws.on(WebSocketShardEvents.Dispatch, ({ data }) => {
      switch (data.t) {
        case GatewayDispatchEvents.Ready:
          this.user = data.d.user;
          this.cache.handles.listeners.get(data.t)?.run?.(data.d);
          break;
        case GatewayDispatchEvents.GuildCreate:
          this.cache.handles.listeners.get(data.t)?.run?.(data.d);
      }
    });
  }
}
