//
import { envParseInteger, envParseString } from '@skyra/env-utilities';
import { Client, container } from '@skyra/http-framework';
import { registerCommands } from '@skyra/shared-http-pieces';
import { createBanner } from '@skyra/start-banner';
import { vice } from 'gradient-string';

const client = new Client();
await client.load();

void registerCommands();

const address = envParseString('HTTP_ADDRESS', '0.0.0.0');
const port = envParseInteger('HTTP_PORT', 8008);
await client.listen({ address, port });
// container.reminders.start();

console.log(
	vice.multiline(
		createBanner({
			logo: [
				String.raw`                        πππ `,
				String.raw`                      ππππππ `,
				String.raw`                      πππππππ `,
				String.raw`                  πππ√ πππππ `,
				String.raw`                 ππππππ πππ `,
				String.raw`                 ππππππ πππ ππππππ `,
				String.raw`                  ππππ  ππππππ  ππ `,
				String.raw`             ππππ  ππ   πππ ππππππ `,
				String.raw`           πππππππ πππ  πππ  πππ `,
				String.raw`           πππππππ  πππππππ  πππ  πππππ `,
				String.raw`            πππππ     πππππ ππππ πππ ππ `,
				String.raw`             π ππ       π ππππ   ππππππ `,
				String.raw`               ππππ     πππ        πππ `,
				String.raw`                 ππππ   πππ      πππππ `,
				String.raw`                   ππππππ π    ππππ `,
				String.raw`                      πππππ  ππππ `,
				String.raw`                        πππππππ `,
				String.raw`                        π ππ `,
				''
			],
			name: [
				String.raw`  _________             ___.     `,
				String.raw` /   _____/ ____   _____\_ |__   `,
				String.raw` \_____  \_/ __ \ /     \| __ \  `,
				String.raw` /        \  ___/|  Y Y  \ \_\ \ `,
				String.raw`/_______  /\___  >__|_|  /___  / `,
				String.raw`        \/     \/      \/    \/  `,
				String.raw`.__                              `,
				String.raw`|  | _____    ____   ____  ____  `,
				String.raw`|  | \__  \  /    \_/ ___\/ __ \ `,
				String.raw`|  |__/ __ \|   |  \  \__\  ___/ `,
				String.raw`|____(____  /___|  /\___  >___  >`,
				String.raw`          \/     \/     \/    \/ `
			],
			extra: [
				'',
				`Loaded: ${container.stores.get('commands').size} commands`,
				`      : ${container.stores.get('interaction-handlers').size} interaction handlers`,
				`Listening: ${address}:${port}`
			]
		})
	)
);
