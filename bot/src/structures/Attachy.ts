import { resolveFile } from '#constants/index';
import { AttachmentBuilder } from 'discord.js';

export class Attachy extends AttachmentBuilder {
  public constructor(...args: ConstructorParameters<typeof AttachmentBuilder>) {
    super(...args);
  }

  url = `attachment://${this.name}`;

  data(): '' | Promise<Buffer | string> {
    return resolveFile(this.attachment);
  }
}
