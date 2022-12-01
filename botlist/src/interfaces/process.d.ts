declare module 'process' {
  global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace NodeJS {
      interface ProcessEnv {
        readonly NODE_ENV: 'development' | 'production';
        readonly DISCORD_TOKEN: string;
        readonly DATABASE_URL: string;

        readonly discordBotListAuth: string;
        readonly discordBotsGGAuth: string;
        readonly topGGAuth: string;
        readonly BOT_LISTING_AUTH: string;

        readonly PROD_LOG_ID: string;
        readonly PROD_LOG_TOKEN: string;
        readonly PROD_ERR_LOG_ID: string;
        readonly PROD_ERR_LOG_TOKEN: string;

        readonly DEV_LOG_ID: string;
        readonly DEV_LOG_TOKEN: string;
        readonly DEV_ERR_LOG_ID: string;
        readonly DEV_ERR_LOG_TOKEN: string;
      }
    }
  }
}
