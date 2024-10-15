import { request } from 'undici';
import { type Events } from '#lib/utils/events';
const EVENTS_API_URL =
  process.env.EVENTS_API_URL || 'https://mr5bv92qy1.execute-api.us-east-1.amazonaws.com/prod/global-vars-get';

export const SEGMENTS = ['lte_production', 'lte_production_2', 'lte_production_3', 'lte_production_4'];

export const CRON_SCHEDULE = '* */1 * * *';

interface GlobalVarsResponse {
  data: Record<string, string>;
  dateUpdated: number;
  unixNow: number;
}

export interface ParsedEventData {
  name: EventKeyNames;
  promo: string;
  start: Date;
  end: Date;
  req: string;
}

export type EventKeyNames =
  | 'Webb'
  | 'Fungus'
  | 'Philosophy'
  | 'Money'
  | 'Extinction'
  | 'Pollinator'
  | 'Ocean'
  | 'Tea'
  | 'Music'
  | 'Human Body'
  | 'Visual Art'
  | 'Cat'
  | 'Outbreaks'
  | 'Rock'
  | 'Cryptid'
  | 'Question'; // ideally this will never be used but for the sake of completeness

// now we need to map EventKeyNames to Events, example:
// eventkeyname Webb maps to Events."James Webb"
// eventkeyname Fungus maps to Events.FungusAmongUs

export const EventKeyNamesToEvents: Record<EventKeyNames, Events> = {
  Webb: 'James Webb',
  Fungus: 'Fungus Among Us',
  Philosophy: 'The Big Questions',
  Money: 'The Price of Trust',
  Extinction: 'Life After Apocalypse',
  Pollinator: 'Co-Evolution Love Story',
  Ocean: 'Deep Sea Life: Lurking in the Dark',
  Tea: 'A Journey of Serenity',
  Music: 'Good Vibrations',
  'Human Body': 'Human Body',
  'Visual Art': 'Visual Art',
  Cat: 'Cats',
  Outbreaks: 'Outbreaks',
  Rock: 'Rock',
  Cryptid: 'Cryptids',
  Question: '?',
};

export async function fetchEvents(): Promise<GlobalVarsResponse | null> {
  console.log(`[EventScheduler] Fetching events from: ${EVENTS_API_URL}`);
  try {
    const response = await request(EVENTS_API_URL);
    if (response.statusCode !== 200) {
      throw new Error(`Failed to fetch events: ${response.statusCode}`);
    }

    const rawData = await response.body.text();

    const data: GlobalVarsResponse = JSON.parse(rawData);
    if (!data) {
      throw new Error('Invalid events data');
    }

    return data;
  } catch (error) {
    console.log(`[EventScheduler] Failed to fetch events: ${error}`);
    return null;
  }
}

/**
 * Parses a segment data string into a structured ExternalEventData object.
 *
 * @param segmentData - The raw segment data string from the API. example: "name=pollen14?promo=01/01/2023?start=10/14/2024 3:10 PM?end=10/17/2024 3:00 PM? = 29.58"
 * @returns An ParsedEventData object if parsing is successful; otherwise, null.
 */

export function parseSegmentData(segmentData: string): ParsedEventData | null {
  try {
    const parts = segmentData.split('?');
    const data: Record<string, string> = {};
    for (const part of parts) {
      const [key, value] = part.split('=');
      if (key && value) {
        data[key.trim()] = value.trim();
      }
    }

    if (data.name && data.promo && data.start && data.end) {
      return {
        name: data.name as EventKeyNames,
        promo: data.promo,
        start: parseUTCDate(data.start),
        end: parseUTCDate(data.end),
        req: data.req,
      };
    } else {
      console.warn(`[EventScheduler] Incomplete event data: ${segmentData}`);
      return null;
    }
  } catch (error) {
    console.error(`[EventScheduler] Failed to parse segment data: ${segmentData}`, error);
    return null;
  }
}

function parseUTCDate(dateString: string): Date {
  const date = new Date(dateString);

  // Return the date parsed in UTC
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds(),
    ),
  );
}
