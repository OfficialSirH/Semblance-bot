use std::time::SystemTime;

use actix_web::{http::header::HeaderMap, Error};
use base64::{engine::general_purpose, Engine};
use crypto::{hmac::Hmac, mac::Mac, sha1::Sha1};
use twilight_model::{
    id::{marker::UserMarker, Id},
    user::{User, UserFlags},
    util::ImageHash,
};

use crate::{
    errors::{InternalErrorConverter, MyError},
    models::{AccessTokenResponse, LinkedRolesMetadata},
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
// TODO: finish implementing these utility functions
/*
/**
 * Given an OAuth2 code from the scope approval page, make a request to Discord's
 * OAuth2 service to retrieve an access token, refresh token, and expiration.
 */
export async function getOAuthTokens(code) {
  const url = 'https://discord.com/api/v10/oauth2/token';
  const body = new URLSearchParams({
    client_id: config.DISCORD_CLIENT_ID,
    client_secret: config.DISCORD_CLIENT_SECRET,
    grant_type: 'authorization_code',
    code,
    redirect_uri: config.DISCORD_REDIRECT_URI,
  });

  const response = await fetch(url, {
    body,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw new Error(`Error fetching OAuth tokens: [${response.status}] ${response.statusText}`);
  }
}
*/
pub async fn get_oauth_tokens(code: &String) -> Result<AccessTokenResponse, MyError> {
    Ok(AccessTokenResponse {
        access_token: "test".to_owned(),
        token_type: "test".to_owned(),
        expires_in: 69420,
        refresh_token: "test".to_owned(),
        scope: "test".to_owned(),
    })
}

/*
/**
 * The initial token request comes with both an access token and a refresh
 * token.  Check if the access token has expired, and if it has, use the
 * refresh token to acquire a new, fresh access token.
 */
export async function getAccessToken(userId, tokens) {
  if (Date.now() > tokens.expires_at) {
    const url = 'https://discord.com/api/v10/oauth2/token';
    const body = new URLSearchParams({
      client_id: config.DISCORD_CLIENT_ID,
      client_secret: config.DISCORD_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: tokens.refresh_token,
    });
    const response = await fetch(url, {
      body,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    if (response.ok) {
      const tokens = await response.json();
      tokens.expires_at = Date.now() + tokens.expires_in * 1000;
      await storage.storeDiscordTokens(userId, tokens);
      return tokens.access_token;
    } else {
      throw new Error(`Error refreshing access token: [${response.status}] ${response.statusText}`);
    }
  }
  return tokens.access_token;
}
*/
// note: 'tokens', 'metadata', and the return value isn't going to be string, just doing it as a placeholder for now
// TODO: make sure this function does very similary to the JS example above, wouldn't want to forget that I need to update the entry's expiration time and access token
pub async fn get_access_token(
    user_id: &String,
    refresh_token: String,
    expires_in: SystemTime,
) -> Result<String, MyError> {
    Ok("test".to_string())
}

/*
/**
 * Given a user based access token, fetch profile information for the current user.
 */
export async function getUserData(tokens) {
  const url = 'https://discord.com/api/v10/oauth2/@me';
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${tokens.access_token}`,
    },
  });
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw new Error(`Error fetching user data: [${response.status}] ${response.statusText}`);
  }
}
*/
// note: 'tokens' and the return value isn't going to be string, just doing it as a placeholder for now
pub async fn get_discord_user(access_token: &String) -> Result<User, MyError> {
    Ok(User {
        id: Id::<UserMarker>::new(
            str::parse::<u64>("Test").make_internal_error("parsing discord id failed")?,
        ),
        discriminator: 420,
        avatar: Some(ImageHash::new(
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
            true,
        )),
        bot: false,
        system: Some(false),
        mfa_enabled: Some(false),
        locale: Some("test".to_string()),
        verified: Some(false),
        email: Some("test".to_string()),
        flags: Some(UserFlags::empty()),
        premium_type: Some(twilight_model::user::PremiumType::Nitro),
        public_flags: Some(UserFlags::empty()),
        accent_color: Some(0),
        name: "test".to_string(),
        banner: None,
    })
}

/*
/**
 * Given metadata that matches the schema, push that data to Discord on behalf
 * of the current user.
 */
export async function pushMetadata(userId, tokens, metadata) {
  // PUT /users/@me/applications/:id/role-connection
  const url = `https://discord.com/api/v10/users/@me/applications/${config.DISCORD_CLIENT_ID}/role-connection`;
  const accessToken = await getAccessToken(userId, tokens);
  const body = {
    platform_name: 'Example Linked Role Discord Bot',
    metadata,
  };
  const response = await fetch(url, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error(`Error pushing discord metadata: [${response.status}] ${response.statusText}`);
  }
}
 */
// note: 'tokens', 'metadata', and the return value isn't going to be string, just doing it as a placeholder for now
pub async fn update_linked_roles_metadata(
    user_id: &String,
    tokens: String,
    metadata: LinkedRolesMetadata,
) -> Result<String, MyError> {
    Ok("test".to_string())
}
