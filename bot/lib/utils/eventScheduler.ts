import { GuildId } from '#constants/index';
import { Routes } from '@discordjs/core';
import { request } from 'undici';
import { Client } from '@discordjs/core';

const EVENTS_API_URL =
  process.env.EVENTS_API_URL || 'https://mr5bv92qy1.execute-api.us-east-1.amazonaws.com/prod/global-vars-get';

const SEGMENTS = ['lte_production', 'lte_production_2', 'lte_production_3', 'lte_production_4'];

const CRON_SCHEDULE = '* */1 * * *';

interface ExternalEventData {
  name: string;
  promo: string;
  start: string;
  end: string;
  req: string;
}

interface GlobalVarsResponse {
  data: Record<string, string>;
  dateUpdated: number;
  unixNow: number;
}

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
 * @returns An ExternalEventData object if parsing is successful; otherwise, null.
 */

export function parseSegmentData(segmentData: string): ExternalEventData | null {
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
        name: data.name,
        promo: data.promo,
        start: data.start,
        end: data.end,
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

/**
 * Extracts a clean segment name from the segment key.
 * For example, "lte_production_2" becomes "production_2".
 *
 * @param segmentKey - The original segment key string.
 * @returns The cleaned segment name.
 */
function getSegmentName(segmentKey: string): string {
  const parts = segmentKey.split('_');
  if (parts.length >= 2) {
    return parts.slice(1).join('_');
  }
  return segmentKey;
}

export function parseUTCDate(dateString: string): Date {
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
