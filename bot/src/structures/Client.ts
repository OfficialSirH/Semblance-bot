import { Collection } from '@discordjs/collection';
import Prisma from '@prisma/client';
import { FastifyBasedAPI } from './DiscordAPI';
import { isProduction, token } from '#constants/index';
import { WebhookLogger } from './WebhookLogger';
import { LogLevel } from '@sapphire/framework';
import { REST } from '@discordjs/rest';
import { WebSocketManager, WebSocketShardEvents } from '@discordjs/ws';
import { readdir } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import type { Command } from './Command';
import type { Event } from './Event';
import { type Snowflake, type APIGuild, GatewayDispatchEvents, GatewayIntentBits, createClient } from '@discordjs/core';

export class Client {
  public cache: {
    guilds: Collection<Snowflake, APIGuild>;
    events: Collection<GatewayDispatchEvents, Event>;
    commands: Collection<Snowflake, Command>;
  } = {
    guilds: new Collection(),
    events: new Collection(),
    commands: new Collection(),
  };

  public logger = new WebhookLogger(isProduction ? LogLevel.Info : LogLevel.Debug);
  public db = new Prisma.PrismaClient();

  public rest = new REST({ version: '10' }).setToken(token);
  public ws = new WebSocketManager({
    token,
    intents: GatewayIntentBits.Guilds,
    rest: this.rest,
  });
  public core = createClient({ rest: this.rest, ws: this.ws });
  public api = new FastifyBasedAPI(this.rest);

  async login() {
    await this.loadCommands();
    await this.loadEvents();
    await this.ws.connect();
  }

  async loadCommands() {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const commandFiles = (await readdir(join(__dirname, 'commands'))).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const command = new (await import(join(__dirname, 'commands', file))).default() as Command;
      this.cache.commands.set(command.name, command);
    }
  }

  async loadEvents() {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const eventFiles = (await readdir(join(__dirname, 'events'))).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
      const event = new (await import(join(__dirname, 'events', file))).default() as Event;
      this.cache.events.set(event.name, event);
    }

    this.ws.on(WebSocketShardEvents.Dispatch, ({ data }) => {
      switch (data.t) {
        case GatewayDispatchEvents.Ready:
          this.cache.events.get(GatewayDispatchEvents.Ready)?.run?.(this);
          break;
        case GatewayDispatchEvents.GuildCreate:
          this.cache.events.get(data.t)?.run?.(data.d);
      }
    });
  }
}
