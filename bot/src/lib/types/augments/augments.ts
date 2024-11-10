import type { IntegerString } from '@skyra/env-utilities';

declare module '@skyra/env-utilities' {
	interface Env {
		readonly HTTP_PORT: IntegerString;
		readonly HTTP_ADDRESS: string;

		readonly DATABASE_URL: string;
		readonly EVENTS_API_URL: string;

		readonly PLAYFAB_SECRET_KEY: string;
		readonly PLAYFAB_TITLE_ID: string;

		readonly BETA_JOIN_CHANNEL_ID: string;
		readonly BETA_TESTER_ROLE_ID: string;

		readonly DEPLOY: string;

		readonly DISCORD_TOKEN: string;
		readonly DISCORD_PUBLIC_KEY: string;

		readonly USERDATA_AUTH: string;
		readonly DISCORD_LINK_API_URL: string;

		readonly BOT_LISTING_AUTH: string;
		readonly BOT_LISTING_HANDLER_URL: string;

		readonly CAT_API_KEY: string;
		readonly DOG_API_KEY: string;
		readonly DEEPL_API_KEY: string;

		readonly LOG_ID: string;
		readonly LOG_TOKEN: string;
		readonly ERR_LOG_ID: string;
		readonly ERR_LOG_TOKEN: string;
	}
}
