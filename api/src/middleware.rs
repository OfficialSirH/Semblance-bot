use std::{
    future::{ready, Future, Ready},
    pin::Pin,
};

use actix_web::{
    dev::{forward_ready, Service, ServiceRequest, ServiceResponse, Transform},
    Error,
};

use crate::{
    models::{GameSavesMetadataPostRequest, GameSavesMetadataResponse},
    utilities::{safe_basic_auth_decoder, InvalidItems},
};

type LocalBoxFuture<'a, T> = Pin<Box<dyn Future<Output = T> + 'a>>;

// There are two steps in middleware processing.
// 1. Middleware initialization, middleware factory gets called with
//    next service in chain as parameter.
// 2. Middleware's call method gets called with normal request.
pub struct UserDataAuthorization;

// Middleware factory is `Transform` trait
// `S` - type of the next service
// `B` - type of response's body
impl<S, B> Transform<S, ServiceRequest> for UserDataAuthorization
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error>,
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<B>;
    type Error = Error;
    type InitError = ();
    type Transform = UserDataAuthorizationMiddleware<S>;
    type Future = Ready<Result<Self::Transform, Self::InitError>>;

    fn new_transform(&self, service: S) -> Self::Future {
        ready(Ok(UserDataAuthorizationMiddleware {
            service,
            http_client: reqwest::Client::new(),
        }))
    }
}

pub struct UserDataAuthorizationMiddleware<S> {
    service: S,
    http_client: reqwest::Client,
}

impl<S, B> Service<ServiceRequest> for UserDataAuthorizationMiddleware<S>
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error>,
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<B>;
    type Error = Error;
    type Future = LocalBoxFuture<'static, Result<Self::Response, Self::Error>>;

    forward_ready!(service);

    fn call(&self, req: ServiceRequest) -> Self::Future {
        let headers = &mut req.headers().clone();

        let mut auth_header = headers.remove("authorization");
        let mut distribution_header = headers.remove("X-Distribution-Channel");

        let auth_header = auth_header.next();
        let distribution_header = distribution_header.next();

        let http_client = self.http_client.clone();

        let fut = self.service.call(req);
        Box::pin(async move {
            // obtain the auth header and convert to string
            let auth_header = auth_header.invalid_auth()?;
            let auth_header = auth_header.to_str().invalid_auth()?;

            let auth_header_data = safe_basic_auth_decoder(auth_header)?;

            let config = crate::config::Config::new();

            // retrieve the distibution channel from the header
            let distribution_header = distribution_header.invalid_header()?;
            let distribution_header = distribution_header.to_str().invalid_header()?;

            // check which game save API to use based on the distribution channel
            let url = if distribution_header == "Beta" {
                config.game_saves_dev_api
            } else {
                config.game_saves_prod_api
            };

            let response = http_client
                .post(url)
                .json(&GameSavesMetadataPostRequest {
                    action: "getmetadata".to_owned(),
                    username: auth_header_data.email,
                    token: auth_header_data.token,
                })
                .send()
                .await
                .invalid_auth()?;

            let json_response = response
                .json::<GameSavesMetadataResponse>()
                .await
                .invalid_auth()?;

            println!("response: {:?}", json_response);

            // check if json_response.error is Some and equals "Token expired"
            if let Some(error) = json_response.error {
                if error == "Token expired" {
                    return Err(actix_web::error::ErrorUnauthorized("Token expired"));
                }
            } else if json_response.response_type.is_none() {
                return Err(actix_web::error::ErrorUnauthorized("Invalid credentials"));
            }

            let res = fut.await?;

            Ok(res)
        })
    }
}
