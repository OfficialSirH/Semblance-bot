import type { Snowflake } from 'discord.js';
import _ from 'mongoose';

export interface ReportFormat {
  User: Snowflake;
  bugId: number;
  messageId: Snowflake;
  channelId: Snowflake;
}

const ReportSchema = new _.Schema<ReportFormat>({
  User: String,
  bugId: Number,
  messageId: String,
  channelId: String,
});

export const Report = _.model<ReportFormat>('Reports', ReportSchema, 'Reports');
