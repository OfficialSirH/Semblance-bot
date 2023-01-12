import { resolveFile } from '#constants/index';

export class Attachy {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  public constructor(public readonly path: string, public readonly name: string = path.split('/').pop()!) {
    this.url = `attachment://${this.name}`;
  }

  url: `attachment://${string}`;

  data(): '' | Promise<Buffer | string> {
    return resolveFile(this.path);
  }
}
