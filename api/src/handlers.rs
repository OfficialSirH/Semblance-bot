use std::collections::BTreeMap;

use crate::{
    constants::{ErrorLogType, LOG},
    db::{
        self, create_or_update_linkedrolesuserdata, get_linkedrolesuserdata,
        update_linkedrolesuserdata,
    },
    errors::{ConvertResultErrorToMyError, LogMyError, MyError},
    headers::{Authorization, DistributionChannel},
    models::{
        CreateUserData, LinkedRolesCallbackQuery, LinkedRolesMetadata, LinkedRolesQuery,
        LinkedRolesUserData, MessageResponse, OGUpdateUserData, UpdateLinkedRolesUserData,
        UpdateUserData,
    },
    role_handling::handle_roles,
    utilities::{
        encode_user_token, get_access_token, get_discord_user, get_oauth_tokens,
        update_linked_roles_metadata,
    },
    webhook_logging::webhook_log,
};
use actix_web::{
    cookie::Cookie, delete, get, http::header, patch, post, web, HttpRequest, HttpResponse,
};
use deadpool_postgres::{Client, Pool};
use jwt::{Header, SignWithKey, Token, VerifyWithKey};
use serde::Deserialize;
use uuid::Uuid;

#[derive(Deserialize)]
pub struct PlayerData {
    #[serde(rename = "playerId")]
    player_id: String,
}

#[post("")]
pub async fn og_update_user(
    query: web::Query<PlayerData>,
    received_user: web::Json<OGUpdateUserData>,
    db_pool: web::Data<Pool>,
    config: web::Data<crate::config::Config>,
) -> Result<HttpResponse, MyError> {
    let user_data = received_user.into_inner();
    let config = config.get_ref();

    println!("og update user function");

    let client: Client = db_pool
        .get()
        .await
        .make_response(MyError::InternalError(
            "request failed at creating database client, please try again",
        ))
        .make_log(ErrorLogType::INTERNAL)
        .await?;

    let user_token = encode_user_token(
        &query.player_id,
        &user_data.player_token,
        &config.userdata_auth,
    );

    db::get_userdata(&client, &user_token)
        .await
        .make_response(MyError::InternalError(
            "Failed at retrieving existing data, you may not have your account linked yet",
        ))
        .make_log(ErrorLogType::USER(user_token.to_owned()))
        .await?;

    let updated_data = db::update_userdata(
        &client,
        &user_token,
        &user_data.beta_tester.clone(),
        UpdateUserData::from(user_data),
    )
    .await
    .make_response(MyError::InternalError(
        "The request has unfortunately failed the update",
    ))
    .make_log(ErrorLogType::USER(user_token.to_owned()))
    .await?;

    let gained_roles = handle_roles(&updated_data, config.discord_token.clone())
        .await
        .make_response(MyError::InternalError(
            "The role-handling process has failed",
        ))
        .make_log(ErrorLogType::USER(user_token))
        .await?;
    let roles = if gained_roles.join(", ").is_empty() {
        "The request was successful, but you've already gained all of the possible roles with your current progress".to_owned()
    } else {
        format!(
            "The request was successful, you've gained the following roles: {}",
            gained_roles.join(", ")
        )
    };

    let logged_roles = if gained_roles.join(", ").is_empty() {
        format!(
            "user with ID {} had a successful request but gained no roles",
            updated_data.discord_id
        )
    } else {
        format!(
            "user with ID {} gained the following roles: {}",
            updated_data.discord_id,
            gained_roles.join(", ")
        )
    };

    webhook_log(logged_roles, LOG::INFORMATIONAL).await;
    Ok(HttpResponse::Ok().json(MessageResponse { message: roles }))
}

#[patch("")]
pub async fn update_user(
    auth_header: web::Header<Authorization>,
    distribution_channel: web::Header<DistributionChannel>,
    received_user: web::Json<UpdateUserData>,
    db_pool: web::Data<Pool>,
    config: web::Data<crate::config::Config>,
) -> Result<HttpResponse, MyError> {
    let user_data = received_user.into_inner();
    let distribution_channel = distribution_channel.into_inner();
    let auth_header = auth_header.into_inner();

    let client: Client = db_pool
        .get()
        .await
        .make_response(MyError::InternalError(
            "request failed at creating database client, please try again",
        ))
        .make_log(ErrorLogType::INTERNAL)
        .await?;

    let user_token = encode_user_token(
        &auth_header.email,
        &auth_header.token,
        &config.userdata_auth,
    );

    db::get_userdata(&client, &user_token)
        .await
        .make_response(MyError::InternalError(
            "Failed at retrieving existing data, you may not have your account linked yet",
        ))
        .make_log(ErrorLogType::USER(user_token.to_owned()))
        .await?;

    let updated_data = db::update_userdata(
        &client,
        &user_token,
        &(distribution_channel.0 == "Beta"),
        user_data,
    )
    .await
    .make_response(MyError::InternalError(
        "The request has unfortunately failed the update",
    ))
    .make_log(ErrorLogType::USER(user_token.to_owned()))
    .await?;

    let gained_roles = handle_roles(&updated_data, config.discord_token.clone())
        .await
        .make_response(MyError::InternalError(
            "The role-handling process has failed",
        ))
        .make_log(ErrorLogType::USER(user_token))
        .await?;
    let roles = if gained_roles.join(", ").is_empty() {
        "The request was successful, but you've already gained all of the possible roles with your current progress".to_owned()
    } else {
        format!(
            "The request was successful, you've gained the following roles: {}",
            gained_roles.join(", ")
        )
    };

    let logged_roles = if gained_roles.join(", ").is_empty() {
        format!(
            "user with ID {} had a successful request but gained no roles",
            updated_data.discord_id
        )
    } else {
        format!(
            "user with ID {} gained the following roles: {}",
            updated_data.discord_id,
            gained_roles.join(", ")
        )
    };

    webhook_log(logged_roles, LOG::INFORMATIONAL).await;
    Ok(HttpResponse::Ok().json(MessageResponse { message: roles }))
}

#[post("")]
pub async fn create_user(
    req: HttpRequest,
    auth_header: web::Header<Authorization>,
    distribution_channel: Option<web::Header<DistributionChannel>>,
    received_user: web::Json<CreateUserData>,
    db_pool: web::Data<Pool>,
    config: web::Data<crate::config::Config>,
) -> Result<HttpResponse, MyError> {
    // note: may later replace this snippet with some other way of allowing users to create linked data
    let semblance_access = req.headers().get("X-Semblance-Exclusive");
    if semblance_access.is_none() {
        return Ok(HttpResponse::Forbidden().json(MessageResponse {
            message: "You are not allowed to create a user".to_owned(),
        }));
    }
    match semblance_access.unwrap().to_str() {
        Ok(value) => {
            if value != config.userdata_auth {
                return Ok(HttpResponse::Forbidden().json(MessageResponse {
                    message: "You are not allowed to create a user".to_owned(),
                }));
            }
        }
        Err(_) => {
            return Ok(HttpResponse::Forbidden().json(MessageResponse {
                message: "You are not allowed to create a user".to_owned(),
            }))
        }
    };
    // end of code that may later be replaced with some other way of allowing users to create linked data

    let user_data = received_user.into_inner();
    let is_default_userdata = user_data.data.is_none();
    let inner_data = match user_data.data {
        Some(user) => user,
        None => UpdateUserData::default(),
    };

    let distribution_channel = match distribution_channel {
        Some(channel) => channel.into_inner(),
        None => DistributionChannel("".to_owned()),
    };
    let auth_header = auth_header.into_inner();

    let client: Client = db_pool
        .get()
        .await
        .make_response(MyError::InternalError(
            "request failed at creating database client, please try again",
        ))
        .make_log(ErrorLogType::INTERNAL)
        .await?;

    let user_token = encode_user_token(
        &auth_header.email,
        &auth_header.token,
        &config.userdata_auth,
    );

    let user_exists = db::get_userdata(&client, &user_token)
        .await
        .make_response(MyError::NotFound)
        .make_log(ErrorLogType::USER(user_token.to_owned()))
        .await;
    if user_exists.is_ok() {
        if user_data.discord_id != user_exists?.discord_id {
            return Err(MyError::BadRequest(
                "This account is already bound to another discord id",
            ));
        }
        return Err(MyError::InternalError(
            "You're already linked, please use the update endpoint",
        ));
    }

    // forgot why I had this here, but might remove it if it's completely unnecessary
    // let account_exists_with_id = db::get_userdata_by_id(&client, &user_data.discord_id)
    //     .await
    //     .make_response(MyError::NotFound)
    //     .make_log(ErrorLogType::USER(user_token.to_owned()))
    //     .await;
    // if account_exists_with_id.is_ok() {
    //     return Err(MyError::BadRequest(
    //         "This discord id is already bound to another account",
    //     ));
    // }

    let created_data = db::create_userdata(
        &client,
        &user_token,
        &user_data.discord_id,
        &(distribution_channel.0 == "Beta"),
        inner_data,
    )
    .await
    .make_response(MyError::InternalError(
        "The request has unfortunately failed at creating your account",
    ))
    .make_log(ErrorLogType::USER(user_token.to_owned()))
    .await?;

    if is_default_userdata {
        webhook_log(
            format!(
                "created userdata for user of id '{}'",
                created_data.discord_id
            ),
            LOG::SUCCESSFUL,
        )
        .await;
        return Ok(HttpResponse::Ok().json(created_data));
    }

    let gained_roles = handle_roles(&created_data, config.discord_token.clone())
        .await
        .make_response(MyError::InternalError(
            "The role-handling process has failed",
        ))
        .make_log(ErrorLogType::USER(user_token))
        .await?;
    let roles = if gained_roles.join(", ").is_empty() {
        "The request was successful, but you've already gained all of the possible roles with your current progress".to_owned()
    } else {
        format!(
            "The request was successful, you've gained the following roles: {}",
            gained_roles.join(", ")
        )
    };

    let logged_roles = if gained_roles.join(", ").is_empty() {
        format!(
            "user with ID {} had a successful request but gained no roles",
            created_data.discord_id
        )
    } else {
        format!(
            "user with ID {} gained the following roles: {}",
            created_data.discord_id,
            gained_roles.join(", ")
        )
    };

    webhook_log(logged_roles, LOG::INFORMATIONAL).await;
    Ok(HttpResponse::Ok().json(MessageResponse { message: roles }))
}

#[delete("")]
pub async fn delete_user(
    auth_header: web::Header<Authorization>,
    db_pool: web::Data<Pool>,
    config: web::Data<crate::config::Config>,
) -> Result<HttpResponse, MyError> {
    let client: Client = db_pool
        .get()
        .await
        .make_response(MyError::InternalError(
            "request failed at creating database client, please try again",
        ))
        .make_log(ErrorLogType::INTERNAL)
        .await?;

    let user_token = encode_user_token(
        &auth_header.email,
        &auth_header.token,
        &config.userdata_auth,
    );

    db::delete_userdata(&client, &user_token) // TODO: replace with delete_userdata once it's implemented
        .await
        .make_response(MyError::InternalError(
            "Failed at deleting userdata, this token may not be valid",
        ))
        .make_log(ErrorLogType::USER(user_token.to_owned()))
        .await?;

    Ok(HttpResponse::NoContent().finish())
}

use hmac::{Hmac, Mac};
use sha2::Sha256;

#[get("")]
pub async fn authorize_linked_roles(
    query: web::Query<LinkedRolesQuery>,
    _db_pool: web::Data<Pool>,
    config: web::Data<crate::config::Config>,
) -> Result<HttpResponse, MyError> {
    let state = Uuid::new_v4()
        .as_bytes()
        .iter()
        .map(|byte| format!("{:02x?}", byte))
        .collect::<String>();

    let key: Hmac<Sha256> = Hmac::new_from_slice(config.userdata_auth.as_bytes()).unwrap();
    let header = Header {
        algorithm: jwt::AlgorithmType::Hs256,
        ..Default::default()
    };
    let mut claims = BTreeMap::new();

    claims.insert("email", query.email.to_owned());
    claims.insert("token", query.token.to_owned());

    let token = Token::new(header, claims).sign_with_key(&key).unwrap();

    let auth_url = format!(
        "https://discord.com/api/oauth2/authorize?client_id={}&redirect_uri={}&response_type=code&scope=identify%20role_connections.write&prompt=consent&state={}",
        config.client_id,
        config.redirect_uri,
        state
    );

    Ok(HttpResponse::Found()
        .cookie(Cookie::build("clientState", state).secure(true).finish())
        .cookie(
            Cookie::build("secretClaims", token.as_str())
                .secure(true)
                .finish(),
        )
        .append_header((header::LOCATION, auth_url))
        .finish())
}

#[get("/oauth-callback")]
pub async fn linked_roles_oauth_callback(
    req: HttpRequest,
    query: web::Query<LinkedRolesCallbackQuery>,
    db_pool: web::Data<Pool>,
    config: web::Data<crate::config::Config>,
) -> Result<HttpResponse, MyError> {
    let client_state = req.cookie("clientState");

    if client_state.is_none() {
        return Ok(HttpResponse::BadRequest().body("Missing clientState cookie"));
    }

    if client_state.unwrap().value() != query.state {
        return Ok(HttpResponse::BadRequest().body("State verification failed"));
    }

    let secret_claims = req.cookie("secretClaims");

    if secret_claims.is_none() {
        return Ok(HttpResponse::BadRequest().body("Missing secretClaims cookie"));
    }

    let secret_claims = secret_claims.unwrap().value().to_owned();

    let client: Client = db_pool
        .get()
        .await
        .make_response(MyError::InternalError(
            "request failed at creating database client, please try again",
        ))
        .make_log(ErrorLogType::INTERNAL)
        .await?;

    let key: Hmac<Sha256> = Hmac::new_from_slice(config.userdata_auth.as_bytes()).unwrap();
    let token: Token<Header, BTreeMap<String, String>, _> =
        VerifyWithKey::verify_with_key(secret_claims.as_str(), &key).unwrap();
    let claims = token.claims();

    let user_token = encode_user_token(
        claims["email"].as_str(),
        claims["token"].as_str(),
        &config.userdata_auth,
    );

    let tokens = get_oauth_tokens(&query.code)
        .await
        .make_response(MyError::InternalError("Failed at getting oauth tokens"))
        .make_log(ErrorLogType::INTERNAL)
        .await?;

    let discord_user = get_discord_user(&tokens.access_token)
        .await
        .make_response(MyError::InternalError("Failed at getting user data"))
        .make_log(ErrorLogType::INTERNAL)
        .await?;

    create_or_update_linkedrolesuserdata(&client, user_token, discord_user.id.to_string(), tokens)
        .await
        .make_response(MyError::InternalError(
            "Failed at creating or updating linked roles user data",
        ))
        .make_log(ErrorLogType::INTERNAL)
        .await?;

    Ok(HttpResponse::Ok().body("You've successfully linked your game to Semblance, you can now use the in-game 'Update Stats' button"))
}

#[post("/update")]
pub async fn update_linked_roles(
    auth_header: web::Header<Authorization>,
    game_data: web::Json<UpdateLinkedRolesUserData>,
    db_pool: web::Data<Pool>,
    config: web::Data<crate::config::Config>,
) -> Result<HttpResponse, MyError> {
    let auth_header = auth_header.into_inner();
    let game_data = game_data.into_inner();

    let client: Client = db_pool
        .get()
        .await
        .make_response(MyError::InternalError(
            "request failed at creating database client, please try again",
        ))
        .make_log(ErrorLogType::INTERNAL)
        .await?;

    let token = encode_user_token(
        &auth_header.email,
        &auth_header.token,
        &config.userdata_auth,
    );

    let linked_user = get_linkedrolesuserdata(&client, token.as_str())
        .await
        .make_response(MyError::InternalError(
            "Failed at getting linked roles user data",
        ))
        .make_log(ErrorLogType::INTERNAL)
        .await?;

    let tokens = get_access_token(
        &linked_user.discord_id,
        linked_user.refresh_token,
        linked_user.expires_in,
    )
    .await
    .make_response(MyError::InternalError("Failed at getting access token"))
    .make_log(ErrorLogType::INTERNAL)
    .await?;

    update_linkedrolesuserdata(&client, token.as_str(), &game_data)
        .await
        .make_response(MyError::InternalError(
            "Failed at updating linked roles user data",
        ))
        .make_log(ErrorLogType::INTERNAL)
        .await?;

    update_linked_roles_metadata(
        &linked_user.discord_id,
        tokens,
        LinkedRolesMetadata::from(game_data),
    )
    .await?;

    Ok(HttpResponse::Ok().finish())
}
