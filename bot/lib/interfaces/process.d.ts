declare module 'process' {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        readonly NODE_ENV: 'development' | 'production';
        readonly PORT: number;
        readonly TOKEN: string;
        readonly DEV_TOKEN: string;
        readonly DATABASE_URL: string;
        readonly EVENTS_API_URL: string;

        readonly PLAYFAB_SECRET_KEY: string;
        readonly PLAYFAB_TITLE_ID: string;
        readonly BETA_JOIN_CHANNEL_ID: string;
        readonly BETA_TESTER_ROLE_ID: string;

        readonly DEPLOY: string;

        readonly PUBLIC_KEY: string;
        readonly DEV_PUBLIC_KEY: string;

        readonly USERDATA_AUTH: string;
        readonly DISCORD_LINK_API_URL: string;

        readonly BOT_LISTING_AUTH: string;
        readonly BOT_LISTING_HANDLER_URL: string;

        readonly CAT_API_KEY: string;
        readonly DOG_API_KEY: string;
        readonly DEEPL_API_KEY: string;

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
