use actix_web::http::header::{
    Header, HeaderName, HeaderValue, InvalidHeaderValue, TryIntoHeaderValue,
};

use crate::utilities::AuthData;

pub struct DistributionChannel(pub String);

impl TryIntoHeaderValue for DistributionChannel {
    type Error = InvalidHeaderValue;

    fn try_into_value(self) -> Result<HeaderValue, Self::Error> {
        HeaderValue::from_str(&self.0)
    }
}

impl Header for DistributionChannel {
    fn name() -> HeaderName {
        HeaderName::from_static("x-distribution-channel")
    }

    fn parse<M: actix_web::HttpMessage>(msg: &M) -> Result<Self, actix_web::error::ParseError> {
        let value = msg
            .headers()
            .get(Self::name())
            .ok_or(actix_web::error::ParseError::Header)?;
        Ok(DistributionChannel(value.to_str().unwrap().to_string()))
    }
}

pub struct Authorization {
    pub email: String,
    pub token: String,
}

impl TryIntoHeaderValue for Authorization {
    type Error = InvalidHeaderValue;

    fn try_into_value(self) -> Result<HeaderValue, Self::Error> {
        // encode the email and token to "Basic {base64(email:player_token)}"
        let auth_header = format!(
            "Basic {}",
            base64::encode(&format!("{}:{}", self.email, self.token))
        );
        HeaderValue::from_str(&auth_header)
    }
}

impl Header for Authorization {
    fn name() -> HeaderName {
        HeaderName::from_static("authorization")
    }

    fn parse<M: actix_web::HttpMessage>(msg: &M) -> Result<Self, actix_web::error::ParseError> {
        let value = msg
            .headers()
            .get(Self::name())
            .ok_or(actix_web::error::ParseError::Header)?;

        let auth_data = AuthData::from(value.to_str().unwrap());

        Ok(Authorization {
            email: auth_data.email,
            token: auth_data.token,
        })
    }
}

// TODO: I guess implement a header for parsing "x-secret-key" header just for create route?
// note: may be better to receive a temporary discord token from a user via OAuth2 to confirm it's their account they're linking
