use std::collections::BTreeMap;

use crate::{
    constants::ErrorLogType,
    db::{
        create_or_update_linkedrolesuserdata, get_linkedrolesuserdata, update_linkedrolesuserdata,
        update_linkedrolesuserdata_token,
    },
    errors::{ConvertResultErrorToMyError, LogMyError, MyError},
    headers::Authorization,
    models::{
        LinkedRolesCallbackQuery, LinkedRolesMetadata, LinkedRolesQuery, MessageResponse,
        PostLinkedRolesUserDataBody, PostRefreshTokenBody,
    },
    utils::{encode_user_token, get_discord_user, get_oauth_tokens, update_linked_roles_metadata},
};
use actix_web::{cookie::Cookie, get, http::header, patch, post, web, HttpRequest, HttpResponse};
use deadpool_postgres::{Client, Pool};
use hmac::{Hmac, Mac};
use jwt::{Header, SignWithKey, Token, VerifyWithKey};
use sha2::Sha256;
use uuid::Uuid;

#[deprecated(since = "0.1.0", note = "please use update_linked_roles instead")]
#[patch("")]
pub async fn update_user() -> Result<HttpResponse, MyError> {
    Ok(HttpResponse::Ok().json(MessageResponse { message: "this stat-updating method no longer works as it's been replaced with a new feature from discord called Linked Roles.".to_owned() }))
}

#[deprecated(
    since = "0.1.0",
    note = "There's no specific alternative, technically authorize_linked_roles and linked_roles_oauth_callback are the combined alternative."
)]
#[post("")]
pub async fn create_user() -> Result<HttpResponse, MyError> {
    Ok(HttpResponse::Ok().json(MessageResponse { message: "This method of linking your progress has now been removed, please instead use the oauth method of linking".to_owned() }))
}

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
        .make_log(ErrorLogType::INTERNAL)
        .await?;

    let discord_user = get_discord_user(&tokens.access_token)
        .await
        .make_log(ErrorLogType::INTERNAL)
        .await?;

    create_or_update_linkedrolesuserdata(
        &client,
        &user_token,
        &discord_user.user.unwrap().id.to_string(),
        &tokens,
    )
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
    game_data: web::Json<PostLinkedRolesUserDataBody>,
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

    update_linkedrolesuserdata(&client, token.as_str(), &game_data)
        .await
        .make_response(MyError::InternalError(
            "Failed at updating linked roles user data",
        ))
        .make_log(ErrorLogType::INTERNAL)
        .await?;

    update_linked_roles_metadata(&client, linked_user, LinkedRolesMetadata::from(game_data))
        .await?;

    Ok(HttpResponse::Ok().json(MessageResponse {
        message: "Successfully updated linked roles".to_owned(),
    }))
}

/// Refreshes the game access token
/// ## Note
/// The original token goes through the json body and the new token goes through the authorization header
#[patch("/refresh-token")]
pub async fn refresh_game_access_token(
    data: web::Json<PostRefreshTokenBody>,
    auth_header: web::Header<Authorization>,
    db_pool: web::Data<Pool>,
    config: web::Data<crate::config::Config>,
) -> Result<HttpResponse, MyError> {
    let auth_header = auth_header.into_inner();

    let client: Client = db_pool
        .get()
        .await
        .make_response(MyError::InternalError(
            "request failed at creating database client, please try again",
        ))
        .make_log(ErrorLogType::INTERNAL)
        .await?;

    let initial_token = encode_user_token(
        &auth_header.email,
        &data.initial_access_token,
        &config.userdata_auth,
    );

    let new_token = encode_user_token(
        &auth_header.email,
        &auth_header.token,
        &config.userdata_auth,
    );

    get_linkedrolesuserdata(&client, &initial_token.as_str())
        .await
        .make_response(MyError::InternalError(
            "Failed at getting linked roles user data",
        ))
        .make_log(ErrorLogType::INTERNAL)
        .await?;

    update_linkedrolesuserdata_token(&client, initial_token.as_str(), new_token.as_str())
        .await
        .make_response(MyError::InternalError(
            "Failed at updating linked roles game-related access token",
        ))
        .make_log(ErrorLogType::INTERNAL)
        .await?;

    Ok(HttpResponse::Ok().finish())
}
