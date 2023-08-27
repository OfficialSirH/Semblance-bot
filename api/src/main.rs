#![feature(result_option_inspect)]

pub mod config;
pub mod constants;
pub mod db;
pub mod errors;
mod handlers;
pub mod headers;
pub mod middleware;
pub mod models;
pub mod utils;
pub mod webhook_logging;

use actix_web::{
    guard, main,
    web::{self, Data},
    App, HttpServer,
};
use deadpool_postgres::Runtime;
use dotenv::dotenv;
use tokio_postgres::NoTls;
use webhook_logging::webhook_log;

use crate::handlers::{create_user, update_user};

#[main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();

    let config = crate::config::Config::new();
    let pool = config.pg.create_pool(Some(Runtime::Tokio1), NoTls).unwrap();

    let server = HttpServer::new(move || {
        App::new()
            .app_data(Data::new(pool.clone()))
            .app_data(Data::new(crate::config::Config::new()))
            .service(
                web::scope("/v2/userdata")
                    .wrap(middleware::UserDataAuthorization {})
                    .guard(guard::Header("content-type", "application/json"))
                    .service(create_user)
                    .service(update_user),
            )
            .service(
                web::scope("/linked-roles")
                    .wrap(middleware::UserDataAuthorization {})
                    .service(handlers::linked_roles_oauth_callback)
                    .service(handlers::authorize_linked_roles)
                    .service(handlers::update_linked_roles)
                    .service(handlers::refresh_game_access_token),
            )
    })
    .bind(config.server_addr.clone())?
    .run();
    webhook_log(
        format!("Server running at http://{}/", config.server_addr),
        constants::LOG::SUCCESSFUL,
    )
    .await;
    println!("Server running at http://{}/", config.server_addr);

    server.await
}
