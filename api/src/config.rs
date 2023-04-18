use dotenv::vars;

#[derive(Debug)]
pub struct Config {
    pub discord_token: String,
    pub client_id: String,
    pub client_secret: String,
    pub redirect_uri: String,
    pub webhook_id: String,
    pub webhook_token: String,
    pub userdata_auth: String,
    pub server_addr: String,
    // TODO: update this to use the new game saves API (Server Endpoint namespace)
    pub game_saves_dev_api: String,
    pub game_saves_prod_api: String,
    pub pg: deadpool_postgres::Config,
}
impl Config {
    pub fn new() -> Self {
        let environment_vars: Vec<(String, String)> = vars().collect();
        let mut database_config = deadpool_postgres::Config::new();
        Config::setup_pg_config(&mut database_config, &environment_vars);
        Config {
            discord_token: find_key(&environment_vars, "DISCORD_TOKEN"),
            client_id: find_key(&environment_vars, "CLIENT_ID"),
            client_secret: find_key(&environment_vars, "CLIENT_SECRET"),
            redirect_uri: find_key(&environment_vars, "REDIRECT_URI"),
            webhook_id: find_key(&environment_vars, "WEBHOOK_ID"),
            webhook_token: find_key(&environment_vars, "WEBHOOK_TOKEN"),
            userdata_auth: find_key(&environment_vars, "USERDATA_AUTH"),
            server_addr: find_key(&environment_vars, "SERVER_ADDR"),
            game_saves_dev_api: find_key(&environment_vars, "GAME_SAVES_DEV_API"),
            game_saves_prod_api: find_key(&environment_vars, "GAME_SAVES_PROD_API"),
            pg: database_config,
        }
    }

    fn setup_pg_config<'a>(
        db_config: &'a mut deadpool_postgres::Config,
        env_vars: &'a [(String, String)],
    ) -> &'a mut deadpool_postgres::Config {
        db_config.user = Some(find_key(env_vars, "DBUSER"));
        db_config.password = Some(find_key(env_vars, "PASSWORD"));
        db_config.host = Some(find_key(env_vars, "HOST"));
        db_config.port = Some(find_key(env_vars, "PORT").parse().unwrap());
        db_config.dbname = Some(find_key(env_vars, "DBNAME"));
        db_config
    }
}

impl Default for Config {
    fn default() -> Self {
        Config::new()
    }
}

pub fn find_key(iteration: &[(String, String)], key_search: &'static str) -> String {
    match iteration.iter().find(|(key, _)| key == key_search) {
        Some((_, value)) => value.to_string(),
        None => panic!(
            "couldn't find '{}' in the environment variables",
            key_search
        ),
    }
}
