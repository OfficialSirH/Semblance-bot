use std::{
    future::{ready, Future, Ready},
    pin::Pin,
};

use actix_web::{
    dev::{forward_ready, Service, ServiceRequest, ServiceResponse, Transform},
    web::Query,
    Error,
};

use crate::{
    models::{GameSavesMetadataPostRequest, GameSavesMetadataResponse, LinkedRolesQuery},
    utilities::{safe_basic_auth_decoder, AuthData, InvalidItems},
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
        ready(Ok(UserDataAuthorizationMiddleware { service }))
    }
}

pub struct UserDataAuthorizationMiddleware<S> {
    service: S,
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
        // set boolean 'is_header_auth' to true if the path is NOT /linked_roles
        let is_header_auth = req.path() != "/linked_roles";
        any_middleware_authorization(is_header_auth, &self.service, req)
    }
}

fn any_middleware_authorization<S, B>(
    header_type_authorization: bool,
    service: &S,
    req: ServiceRequest,
) -> LocalBoxFuture<'static, Result<ServiceResponse<B>, Error>>
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error>,
    S::Future: 'static,
    B: 'static,
{
    let headers = &mut req.headers().clone();
    let query = Query::<LinkedRolesQuery>::from_query(req.query_string());

    let auth_header = headers.remove("authorization").next();
    let distribution_header = headers.remove("X-Distribution-Channel").next();

    let fut = service.call(req);
    Box::pin(async move {
        let distribution: String;
        let data: AuthData;

        if header_type_authorization {
            // obtain the auth header and convert to string
            let auth_header = auth_header.invalid_auth()?;
            let auth_header = auth_header.to_str().invalid_auth()?;

            let auth_header_data = safe_basic_auth_decoder(auth_header)?;

            // retrieve the distribution channel from the header
            let distribution_header = distribution_header.invalid_header()?;
            let distribution_header = distribution_header.to_str().invalid_header()?;

            distribution = distribution_header.to_owned();
            data = auth_header_data;
        } else {
            let query = query.invalid_auth()?;
            distribution = query.distribution.to_owned();
            data = AuthData {
                email: query.email.clone(),
                token: query.token.clone(),
            };
        }

        let config = crate::config::Config::new();

        // check which game save API to use based on the distribution channel
        let url = if distribution == "Beta" {
            config.game_saves_dev_api
        } else {
            config.game_saves_prod_api
        };

        let response = reqwest::Client::new()
            .post(url)
            .json(&GameSavesMetadataPostRequest {
                action: "getmetadata".to_owned(),
                username: data.email,
                token: data.token,
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
