import fs from 'fs/promises';
import { AttachmentBuilder } from 'discord.js';
import { formattedDate } from '#constants/index';

export const eventAttachments = await (async () => {
  const files = await fs.readdir('./src/images/events/');
  const finalAttachments = {} as Record<
    Exclude<Events, 'James Webb' | 'Fungus Among Us' | '?'> | 'JamesWebb' | 'FungusAmongUs' | 'QuestionMark',
    AttachmentBuilder
  >;
  for (const file of files)
    if (file.endsWith('.png')) {
      const attachment = new AttachmentBuilder(`./src/images/events/${file}`, { name: `attachment://${file}` }),
        attachmentName = file.substring(0, file.indexOf('.'));
      finalAttachments[attachmentName as keyof typeof finalAttachments] = attachment;
    }
  return finalAttachments;
})();

export const gameEvents: Record<Events, GameEvent> = {
  'James Webb': {
    description: (start: number, end: number) =>
      `The James Webb Telescope Exploration has returned to all simulations on ${formattedDate(
        start,
      )} until ${formattedDate(end)}! 🚀 ✨ 

      Get another oppurtunity to build the James Webb Space Telescope and to claim 3 total badges!`,
    image: eventAttachments.JamesWebb,
  },
  'Fungus Among Us': {
    description: (start: number, end: number) =>
      `The fungus are back among us in the return of the Fungus Among Us Exploration. 🍄🙌
      From ${formattedDate(start)} until ${formattedDate(
        end,
      )}, get another chance to collect all three fungi badges! 🏆✨`,
    image: eventAttachments.FungusAmongUs,
  },
  Philosophy: {
    description: (start: number, end: number) =>
      `Test your philosophical knowledge in The Big Questions Exploration. 🧠 ✨ 
      Open your mind and have all your questions answered from ${formattedDate(start)} until ${formattedDate(
        end,
      )}, Dont forget to collect all three badges as well! 🤖`,
    image: eventAttachments.Philosophy,
  },
  Extinction: {
    description: (start: number, end: number) =>
      `Dive headfirst into the dangers of extinction in this exploration... Life After Apocalypse! 🌋 💥 🌱 
      Play from ${formattedDate(start)} until ${formattedDate(
        end,
      )}, and explore the five biggest mass extinctions of the past (+1 of the present)! `,
    image: eventAttachments.Extinction,
  },
  Money: {
    description: (start: number, end: number) =>
      `Money description from ${formattedDate(start)} to ${formattedDate(end)}`,
    image: eventAttachments.Money,
  },
  '?': {
    description: () => 'Nothing to see here...🕵️',
    image: eventAttachments.QuestionMark,
  },
};

export type Events = 'James Webb' | 'Fungus Among Us' | 'Philosophy' | 'Extinction' | 'Money' | '?';

export interface GameEvent {
  description: (start: number, end: number) => string;
  image: AttachmentBuilder;
}
