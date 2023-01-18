import { resolveFile } from '#constants/index';

export class Attachy {
  public readonly path?: string;
  private _data?: Buffer;

  public constructor(path: string, name?: string);
  public constructor(data: Buffer, name: string);

  public constructor(
    pathOrData: string | Buffer,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    public readonly name: string = (pathOrData as string).split('/').pop()!,
  ) {
    if (typeof pathOrData === 'string') {
      this.path = pathOrData;
    } else {
      this._data = pathOrData;
    }
    this.url = `attachment://${this.name}`;
  }

  url: `attachment://${string}`;

  data(): '' | Promise<Buffer | string> | Buffer {
    return this._data ? this._data : resolveFile(this?.path as string);
  }
}
