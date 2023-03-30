#![feature(result_option_inspect)]

pub mod config;
pub mod constants;
pub mod db;
pub mod errors;
mod handlers;
pub mod headers;
pub mod middleware;
pub mod models;
pub mod role_handling;
pub mod utilities;
pub mod webhook_logging;

use actix_web::{
    guard, main,
    web::{self, Data},
    App, HttpServer,
};
use deadpool_postgres::Runtime;
use dotenv::dotenv;
use handlers::og_update_user;
use tokio_postgres::NoTls;
use webhook_logging::webhook_log;

use crate::handlers::{create_user, delete_user, update_user};

#[main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();

    let config = crate::config::Config::new();
    let pool = config.pg.create_pool(Some(Runtime::Tokio1), NoTls).unwrap();

    let server = HttpServer::new(move || {
        App::new()
            .app_data(Data::new(pool.clone()))
            .app_data(Data::new(crate::config::Config::new()))
            .service(web::scope("/userdata").service(og_update_user))
            .service(
                web::scope("/v2/userdata")
                    .wrap(middleware::UserDataAuthorization {})
                    .guard(guard::Header("content-type", "application/json"))
                    .service(create_user)
                    .service(update_user)
                    .service(delete_user),
            )
            .service(
                web::scope("/linked-roles")
                    .service(handlers::authorize_linked_roles)
                    .service(handlers::linked_roles_oauth_callback)
                    .wrap(middleware::UserDataAuthorization {})
                    .service(handlers::update_linked_roles),
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
