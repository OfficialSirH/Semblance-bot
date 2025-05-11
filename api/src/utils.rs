use std::time::SystemTime;

use actix_web::Error;
use base64::{engine::general_purpose, Engine};
use crypto::{hmac::Hmac, mac::Mac, sha1::Sha1};
use deadpool_postgres::Client;
use reqwest::header::{self, HeaderMap, HeaderValue};
use twilight_model::oauth;

use crate::{
    db::create_or_update_linkedrolesuserdata,
    errors::{InternalErrorConverter, MyError},
    models::{AccessTokenResponse, LinkedRolesMetadata, LinkedRolesPushBody, LinkedRolesUserData},
};

pub trait InvalidItems<T> {
    fn invalid_auth(self) -> Result<T, Error>;

    fn invalid_header(self) -> Result<T, Error>;
}

impl<T> InvalidItems<T> for Option<T> {
    fn invalid_auth(self) -> Result<T, Error> {
        self.ok_or_else(|| actix_web::error::ErrorBadRequest("Invalid authorization header"))
    }

    fn invalid_header(self) -> Result<T, Error> {
        self.ok_or_else(|| actix_web::error::ErrorBadRequest("Invalid header"))
    }
}

impl<T, E: core::fmt::Debug> InvalidItems<T> for Result<T, E> {
    fn invalid_auth(self) -> Result<T, Error> {
        self.map_err(|_| actix_web::error::ErrorBadRequest("Invalid authorization header"))
    }

    fn invalid_header(self) -> Result<T, Error> {
        self.map_err(|_| actix_web::error::ErrorBadRequest("Invalid header"))
    }
}

pub struct AuthData {
    pub email: String,
    pub token: String,
}

/// Parse the authorization header and return the email and token.
///
/// The authorization header is in the format of:
/// `"Basic {base64(email:player_token)}"`
pub fn safe_basic_auth_decoder(auth_header: &str) -> Result<AuthData, Error> {
    // split auth header from "Basic {auth}"
    let auth_header = auth_header.split_whitespace().collect::<Vec<_>>();

    // check if auth header is "Basic"
    if *auth_header.first().invalid_auth()? != "Basic" {
        return Err(actix_web::error::ErrorBadRequest(
            "Invalid authorization header",
        ));
    }

    // obtain the base64 string from the header
    let auth_header = auth_header.get(1).invalid_auth()?;
    // decode base64 from the string
    let auth_header = general_purpose::STANDARD
        .decode(auth_header)
        .invalid_auth()?;

    // convert the bytes to a string
    let auth_header = String::from_utf8(auth_header).invalid_auth()?;

    // get the username and password from the email:player_token
    let auth_header = auth_header.split(':').collect::<Vec<_>>();
    let player_email = auth_header.first().invalid_auth()?;
    let player_token = auth_header.get(1).invalid_auth()?;

    Ok(AuthData {
        email: player_email.to_string(),
        token: player_token.to_string(),
    })
}

impl From<&str> for AuthData {
    fn from(auth_header: &str) -> Self {
        safe_basic_auth_decoder(auth_header).unwrap()
    }
}

impl From<HeaderMap> for AuthData {
    fn from(headers: HeaderMap) -> Self {
        let auth_header = headers.get("authorization").unwrap().to_str().unwrap();

        safe_basic_auth_decoder(auth_header).unwrap()
    }
}

pub fn encode_user_token(email: &str, token: &str, userdata_auth: &str) -> String {
    let mut user_token = Hmac::new(Sha1::new(), userdata_auth.as_bytes());
    user_token.input(email.as_bytes());
    user_token.input(token.as_bytes());

    user_token
        .result()
        .code()
        .iter()
        .map(|byte| format!("{:02x?}", byte))
        .collect::<Vec<String>>()
        .join("")
}

/// Given an OAuth2 code from the scope approval page, make a request to Discord's
/// OAuth2 service to retrieve an access token, refresh token, and expiration.
/// # Errors
/// Returns an error if the request fails.
/// # Examples
/// ```
/// use crate::utils::get_oauth_tokens;
/// use crate::errors::MyError;
/// use crate::models::AccessTokenResponse;
///
/// async fn get_tokens() -> Result<AccessTokenResponse, MyError> {
///    let code = "some_code".to_string();
///   let tokens = get_oauth_tokens(&code).await?;
///  Ok(tokens)
/// }
/// ```
/// # Panics
/// This function will panic if the request fails.
pub async fn get_oauth_tokens(code: &String) -> Result<AccessTokenResponse, MyError> {
    let config = crate::config::Config::new();
    // url encode the required body values
    let url_encoded_string = format!(
        "client_id={}&client_secret={}&grant_type=authorization_code&code={}&redirect_uri={}",
        config.client_id, config.client_secret, code, config.redirect_uri,
    );

    // create the request
    let response = reqwest::Client::new()
        .post("https://discord.com/api/v10/oauth2/token")
        .header("Content-Type", "application/x-www-form-urlencoded")
        .body(url_encoded_string)
        .send()
        .await
        .map_err(|_e| MyError::InternalError("Error fetching OAuth tokens"))?;

    // check if the request was successful
    if response.status().is_success() {
        // parse the response into a struct
        let data = response
            .json::<AccessTokenResponse>()
            .await
            .map_err(|_e| MyError::InternalError("Error parsing OAuth tokens into a struct"))?;

        return Ok(data);
    }

    Err(MyError::InternalError("Error fetching OAuth tokens"))
}

/// Check if the access token has expired, and if it has, use the refresh token to acquire a new, fresh access token.
/// # Errors
/// Returns an error if the request fails.
pub async fn get_access_token(
    client: &Client,
    linked_roles_user_data: &LinkedRolesUserData,
) -> Result<String, MyError> {
    let config = crate::config::Config::new();

    // check if the access token has expired
    if SystemTime::now() > linked_roles_user_data.expires_in {
        // create the request
        let response = reqwest::Client::new()
            .post("https://discord.com/api/v10/oauth2/token")
            .header("Content-Type", "application/x-www-form-urlencoded")
            .body(format!(
                "client_id={}&client_secret={}&grant_type=refresh_token&refresh_token={}",
                config.client_id, config.client_secret, linked_roles_user_data.refresh_token,
            ))
            .send()
            .await
            .map_err(|_e| MyError::InternalError("Error fetching OAuth tokens"))?;

        // check if the request was successful
        if response.status().is_success() {
            // parse the response into a struct
            let tokens = response
                .json::<AccessTokenResponse>()
                .await
                .map_err(|_e| MyError::InternalError("Error parsing OAuth tokens into a struct"))?;
            // update the entry's expiration time and access token
            create_or_update_linkedrolesuserdata(
                client,
                &linked_roles_user_data.token,
                &linked_roles_user_data.discord_id,
                &tokens,
            )
            .await
            .make_internal_error("failed to update linked roles user data")?;

            return Ok(tokens.access_token);
        } else {
            return Err(MyError::InternalError("Error fetching OAuth tokens"));
        }
    }

    // return the access token
    Ok(linked_roles_user_data.access_token.clone())
}

/// Given an access token, make a request to Discord's OAuth2 service to retrieve the user's data.
/// # Errors
/// Returns an error if the request fails.
pub async fn get_discord_user(
    access_token: &String,
) -> Result<oauth::CurrentAuthorizationInformation, MyError> {
    let url = "https://discord.com/api/v10/oauth2/@me";
    let response = reqwest::Client::new()
        .get(url)
        .header("Authorization", format!("Bearer {}", access_token))
        .send()
        .await
        .make_internal_error("error fetching authorized discord user")?;

    if response.status().is_success() {
        let data = response
            .json::<oauth::CurrentAuthorizationInformation>()
            .await
            .make_internal_error("error parsing authorized information into a struct")?;

        return Ok(data);
    }

    Err(MyError::InternalError(
        "error fetching authorized discord user",
    ))
}

/// Update the metadata for a user's linked roles.
/// # Errors
/// Returns an error if the request fails.
pub async fn update_linked_roles_metadata(
    client: &Client,
    user_data: LinkedRolesUserData,
    metadata: LinkedRolesMetadata,
) -> Result<(), MyError> {
    let config = crate::config::Config::new();

    let url = format!(
        "https://discord.com/api/v10/users/@me/applications/{}/role-connection",
        config.client_id
    );
    let access_token = get_access_token(client, &user_data).await?;
    let body = LinkedRolesPushBody {
        platform_name: "Semblance - Cell to Singularity".to_owned(),
        metadata,
    };
    let mut headers = HeaderMap::new();

    headers.append(
        header::AUTHORIZATION,
        format!("Bearer {}", access_token).parse().unwrap(),
    );
    headers.append(
        header::CONTENT_TYPE,
        HeaderValue::from_static("application/json"),
    );

    reqwest::Client::new()
        .put(url)
        .headers(headers)
        .json(&body)
        .send()
        .await
        .make_internal_error("error pushing discord metadata")?;

    Ok(())
}
