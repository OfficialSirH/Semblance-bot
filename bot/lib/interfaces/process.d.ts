declare module 'process' {
  global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace NodeJS {
      interface ProcessEnv {
        readonly NODE_ENV: 'development' | 'production';
        readonly TOKEN: string;
        readonly DEV_TOKEN: string;
        readonly DATABASE_URL: string;

        readonly USERDATA_AUTH: string;
        readonly DISCORD_LINK_API_URL: string;

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
