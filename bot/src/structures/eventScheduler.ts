import { GuildId } from '#constants/index';
import {
  CRON_SCHEDULE,
  EventKeyNamesToEvents,
  fetchEvents,
  parseSegmentData,
  SEGMENTS,
  type EventKeyNames,
  type ParsedEventData,
} from '#lib/utils/eventScheduler';
import { gameEvents, type Events } from '#lib/utils/events';
import type { Client } from '#structures/Client';
import {
  GuildScheduledEventEntityType,
  GuildScheduledEventPrivacyLevel,
  Routes,
  type APIGuildScheduledEvent,
  type RESTPostAPIGuildScheduledEventJSONBody,
} from '@discordjs/core';
import { CronJob } from 'cron';

/**
 * Creates a new Discord scheduled event.
 *
 * @param client - The Discord client instance.
 * @param eventName - The display name of the event.
 * @param startTime - The start time of the event.
 * @param endTime - The end time of the event.
 */
async function createDiscordEvent(client: Client, eventName: Events, startTime: Date, endTime: Date): Promise<void> {
  try {
    const gameEvent = gameEvents[eventName];
    if (!gameEvent) {
      console.warn(`No game event found for event name: ${eventName}`);
      return;
    }

    const description = gameEvent.description(startTime.getTime(), endTime.getTime());
    const image = await gameEvent.image.data();
    const imageBase64 = image.toString('base64');
    const imageBuffer = `data:image/png;base64,${imageBase64}`;

    const body: RESTPostAPIGuildScheduledEventJSONBody = {
      name: `The ${eventName} Exploration!`,
      scheduled_start_time: startTime.toISOString(),
      scheduled_end_time: endTime.toISOString(),
      privacy_level: GuildScheduledEventPrivacyLevel.GuildOnly,
      entity_type: GuildScheduledEventEntityType.External,
      description: description,
      image: imageBuffer,
      // TODO: Add image and description using GameEvent object
      entity_metadata: {
        location: 'Cell to Singularity',
      },
    };

    await client.core.rest.post(Routes.guildScheduledEvents(GuildId.cellToSingularity), {
      body,
    });

    console.log(`Event "${eventName}" created successfully.`);
  } catch (error) {
    console.error(`Failed to create event "${eventName}". Error: ${error}`);
  }
}

/**
 * Starts the event scheduler which periodically fetches events from an external API
 * and synchronizes them with Discord's scheduled events.
 *
 * @param client - The Discord client instance used to interact with the Discord API.
 */

export function startEventScheduler(client: Client) {
  const job = new CronJob(
    CRON_SCHEDULE,
    async () => {
      console.log(`[EventScheduler] Fetching events at ${new Date().toISOString()}`);

      // Fresh array for each cron run
      const eventsFromGlobalVars: ParsedEventData[] = [];

      try {
        const eventGlobalVarsData = await fetchEvents();
        if (!eventGlobalVarsData || !eventGlobalVarsData.data) {
          console.warn('[EventScheduler] No data received from fetchEvents.');
          // TODO: Implement the webhook warn system ?
          return;
        }

        // Iterate through each segment to extract event data
        for (const segmentKey of SEGMENTS) {
          const segmentData = eventGlobalVarsData.data[segmentKey];
          const parsed = parseSegmentData(segmentData);
          if (parsed) {
            eventsFromGlobalVars.push(parsed);
          }
        }
        console.log(
          `[EventScheduler] List of found events from server: ${eventsFromGlobalVars.map(e => e.name).join(', ')}`,
        );
      } catch (error) {
        // TODO: Webhook error system
        console.error(`[EventScheduler] Failed to fetch events: ${error}`);
        return;
      }

      // Fetch existing scheduled events from Discord
      try {
        const existingEventsResponse = await client.core.rest.get(
          Routes.guildScheduledEvents(GuildId.cellToSingularity),
        );

        const existingEvents = existingEventsResponse as APIGuildScheduledEvent[];

        if (existingEvents.length > 0) {
          existingEvents.forEach(event => {
            console.log(
              `Event: ${event.name} | Start: ${event.scheduled_start_time} | End: ${event.scheduled_end_time}`,
            );
          });
        } else {
          // TODO: Change to webhook warning
          console.log('No scheduled events found.');
        }

        // Now we compare the fetched events with the existing events
        // and create/update/delete events as necessary
        // The comparable data is the event name, start time, and end time
        for (const event of eventsFromGlobalVars) {
          // First we need to convert the event name to the display name
          const eventName = EventKeyNamesToEvents[event.name as EventKeyNames];
          if (!eventName) {
            console.warn(`[EventScheduler] No display name found for event key: ${event.name}`);
            continue;
          }
          if (event.start.getTime() < Date.now()) {
            console.log(`Event "${eventName}" has already started.`);
            continue;
          }

          // NOTE: The below times should already be in UTC/GMT so we dont need to convert them
          // but this is something to keep in mind if the times are not in UTC
          // from my testing, the times are already in UTC

          const existingEvent = existingEvents.find(
            existing =>
              existing.name === `The ${eventName} Exploration!` &&
              new Date(existing.scheduled_start_time).getTime() === event.start.getTime() &&
              new Date(existing.scheduled_end_time || 0).getTime() === event.end.getTime(),
          );

          if (existingEvent) {
            console.log(`Event "${eventName}" is already scheduled.`);
            continue; // Move to the next event
          }

          // TODO: Implement the webhook system for logging
          console.log(`Creating event: ${eventName}`);

          await createDiscordEvent(client, eventName, event.start, event.end);
        }
      } catch (error) {
        console.error(`[EventScheduler] Error during synchronization: ${error}`);
      }
    },
    null,
    true,
    'UTC',
  ); // Start running the job immediately in UTC time
  job.start();
}
