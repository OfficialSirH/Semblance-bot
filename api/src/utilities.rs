use actix_web::{http::header::HeaderMap, Error};
use crypto::{hmac::Hmac, mac::Mac, sha1::Sha1};

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
    let auth_header = base64::decode(auth_header).invalid_auth()?;

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
