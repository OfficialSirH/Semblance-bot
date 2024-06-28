import { shortFormattedDate } from '#constants/index';
import { Attachy } from '#structures/Attachy';
import fs from 'fs/promises';

type CapitalizeFirstLetter<T extends string> = T extends `${infer L}${infer R}` ? `${Uppercase<L>}${R}` : T;

type ExcludeSpaces<T extends string> = T extends `${infer Before} ${infer After}`
  ? ExcludeSpaces<`${CapitalizeFirstLetter<Before>}${CapitalizeFirstLetter<After>}`>
  : T;

type ExcludeSpecialChars<T extends string> = T extends `${infer Before}${':' | '-'}${infer After}`
  ? ExcludeSpecialChars<`${CapitalizeFirstLetter<Before>}${CapitalizeFirstLetter<After>}`>
  : T;

type EventAttachmentString = ExcludeSpecialChars<ExcludeSpaces<Events>>;

export const eventAttachments = await (async () => {
  const files = await fs.readdir('./src/images/events/');
  const finalAttachments = {} as Record<Exclude<EventAttachmentString, '?'> | 'QuestionMark', Attachy>;
  for (const file of files)
    if (file.endsWith('.png')) {
      const attachment = new Attachy(`./src/images/events/${file}`, `attachment://${file}`),
        attachmentName = file.substring(0, file.indexOf('.'));
      finalAttachments[attachmentName as keyof typeof finalAttachments] = attachment;
    }
  return finalAttachments;
})();

export const gameEvents: Record<Events, GameEvent> = {
  'James Webb': {
    description: (start: number, end: number) =>
      `The James Webb Telescope Exploration has returned to all simulations on ${shortFormattedDate(
        start,
      )} until ${shortFormattedDate(end)}! 🚀 ✨ 

Get another oppurtunity to build the James Webb Space Telescope and to claim 3 total badges!`,
    image: eventAttachments.JamesWebb,
  },
  'Fungus Among Us': {
    description: (start: number, end: number) =>
      `The fungus are back among us in the return of the Fungus Among Us Exploration. 🍄🙌
From ${shortFormattedDate(start)} until ${shortFormattedDate(
        end,
      )}, get another chance to collect all three fungi badges! 🏆✨`,
    image: eventAttachments.FungusAmongUs,
  },
  'The Big Questions': {
    description: (start: number, end: number) =>
      `Test your philosophical knowledge in The Big Questions Exploration. 🧠 ✨ 
Open your mind and have all your questions answered from ${shortFormattedDate(start)} until ${shortFormattedDate(
        end,
      )}, Dont forget to collect all three badges as well! 🤖`,
    image: eventAttachments.TheBigQuestions,
  },
  'Life After Apocalypse': {
    description: (start: number, end: number) =>
      `Dive headfirst into the dangers of extinction in this exploration... Life After Apocalypse! 🌋 💥 🌱 
Play from ${shortFormattedDate(start)} until ${shortFormattedDate(
        end,
      )}, and explore the five biggest mass extinctions of the past (+1 of the present)! `,
    image: eventAttachments.LifeAfterApocalypse,
  },
  'The Price of Trust': {
    description: (start: number, end: number) =>
      `Have you spent any money today? Did you use cash or card? Can you imagine how people spent money 100 years ago, or even 1000 years ago?💸 
      Will you unlock the bank vault and discover the history of currencies?💰 Play The Price of Trust from ${shortFormattedDate(
        start,
      )} to ${shortFormattedDate(end)}`,
    image: eventAttachments.ThePriceOfTrust,
  },
  'Co-Evolution Love Story': {
    description: (start: number, end: number) =>
      `Join the journey of bees and flowers, an inseparable pair that evolved together. 🌺 🐝
      Can their mutual attraction survive treachery, deceit, and the sudden entrance of a powerful, new suitor who breaks all the rules? Played Co-Evolution Love Story from ${shortFormattedDate(
        start,
      )} to ${shortFormattedDate(end)}! 🌼 🐝`,
    image: eventAttachments.CoEvolutionLoveStory,
  },
  'Deep Sea Life: Lurking in the Dark': {
    description: (start: number, end: number) =>
      `From ${shortFormattedDate(start)} to ${shortFormattedDate(
        end,
      )}, discover the ocean's most unique creatures, from microscopic marvels to giant behemoths! 🐋`,
    image: eventAttachments.DeepSeaLifeLurkingInTheDark,
  },
  'A Journey of Serenity': {
    description: (start: number, end: number) =>
      `From ancient rituals to modern teahouses, the allure of tea transcends borders and time. :tea: Discover how a simple leaf transformed societies, sparked revolutions, and calmed souls. Will you steep yourself in the traditions of the past or brew a new understanding for the future? Embark on "A Journey of Serenity" from ${shortFormattedDate(
        start,
      )} to ${shortFormattedDate(end)}.`,
    image: eventAttachments.AJourneyOfSerenity,
  },
  'Good Vibrations': {
    description: (start: number, end: number) =>
      `🎶 Sound is all around us, from the crash of a wave to the tap of a foot. It takes something truly special to turn a sound, a beat or a couple of notes into a medium that can captivate and inspire. How have humans managed to form a global phenomenon from such a simple concept?

      Do you hear that? It's time to move to the beat and Explore: Music - Good Vibrations from ${shortFormattedDate(
        start,
      )} to ${shortFormattedDate(end)} 🎤`,
    image: eventAttachments.GoodVibrations,
  },
  'Human Body': {
    description: (start: number, end: number) =>
      `What is it that makes humans tick? Jump into the body and travel between organs 🫀 . Follow the journey of blood 🩸 and learn how humans function.

      Connect like never before in Explore: Human Body - Anatomy of Life from ${shortFormattedDate(
        start,
      )} to ${shortFormattedDate(end)}`,
    image: eventAttachments.HumanBody,
  },
  '?': {
    description: () => 'Nothing to see here...🕵️',
    image: eventAttachments.QuestionMark,
  },
  'Visual Art': {
    description: (start: number, end: number) =>
      `Unleash your creativity with Visual Art — The Power of Images, a captivating journey through art history 🎨🚀. Immerse yourself in a world of art, collect unique badges, and experience the evolution of creativity . Join the event from ${shortFormattedDate(start)} to ${shortFormattedDate(end)}. 
      Let's transform the canvas of history together! 🎉👩‍🎨`,
    image: eventAttachments.VisualArt,
  },
  Outbreaks: {
    description: (start: number, end: number) =>
      `🦠🌎 Dive into the history of pandemics in our Explore: Outbreaks event. Witness the battle between humans and diseases from ${shortFormattedDate(start)} to ${shortFormattedDate(end)}. Join the fight!`,
    image: eventAttachments.Outbreaks,
  },
  Cats: {
    description: (start: number, end: number) =>
      `🐱✨ Dive into the world of cats at our Explore: Cats event! Learn about their playful behaviors and quirky traits from ${shortFormattedDate(start)} to ${shortFormattedDate(end)}. Join us for a purr-fect adventure with our furry friends!`,
    image: eventAttachments.Cats,
  },
};

export type Events =
  | 'James Webb'
  | 'Fungus Among Us'
  | 'The Big Questions'
  | 'Life After Apocalypse'
  | 'The Price of Trust'
  | 'Co-Evolution Love Story'
  | 'Deep Sea Life: Lurking in the Dark'
  | 'A Journey of Serenity'
  | 'Good Vibrations'
  | 'Human Body'
  | 'Visual Art'
  | 'Outbreaks'
  | 'Cats'
  | '?';

export interface GameEvent {
  description: (start: number, end: number) => string;
  image: Attachy;
}
