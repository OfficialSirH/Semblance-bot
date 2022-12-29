import { resolveFile } from '#constants/index';

export class Attachy {
  public constructor(public readonly path: string, public readonly name: string) {
    this.url = `attachment://${this.name}`;
  }

  url: `attachment://${string}`;

  data(): '' | Promise<Buffer | string> {
    return resolveFile(this.path);
  }
}
