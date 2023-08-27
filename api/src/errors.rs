use actix_web::{
    http::{header, StatusCode},
    HttpResponse, HttpResponseBuilder, ResponseError,
};
use async_trait::async_trait;
use deadpool_postgres::PoolError;
use derive_more::Display;
use tokio_pg_mapper::Error as PGMError;
use tokio_postgres::error::Error as PGError;

use crate::{
    constants::{ErrorLogType, LOG},
    models::MessageResponse,
    webhook_logging::webhook_log,
};

#[derive(Display, Debug)]
pub enum MyError {
    NotFound,
    PGError(PGError),
    PGMError(PGMError),
    PoolError(PoolError),
    #[display(fmt = "Internal Error: {}", _0)]
    InternalError(&'static str),
    #[display(fmt = "Bad Request: {}", _0)]
    BadRequest(&'static str),
    #[display(fmt = "Gateway Timeout: {}", _0)]
    Timeout(&'static str),
}
impl std::error::Error for MyError {}

impl ResponseError for MyError {
    fn error_response(&self) -> HttpResponse {
        HttpResponseBuilder::new(self.status_code())
            .insert_header(header::ContentType::json())
            .json(MessageResponse {
                message: self.to_string(),
            })
    }

    fn status_code(&self) -> StatusCode {
        match *self {
            MyError::BadRequest(_) => StatusCode::BAD_REQUEST,
            MyError::Timeout(_) => StatusCode::GATEWAY_TIMEOUT,
            _ => StatusCode::INTERNAL_SERVER_ERROR,
        }
    }
}

pub trait ConvertResultErrorToMyError<T> {
    fn make_response(self, error_enum: MyError) -> Result<T, MyError>;
}

#[async_trait]
pub trait LogMyError<T> {
    async fn make_log(self, error_type: ErrorLogType) -> Result<T, MyError>;
}

pub trait InternalErrorConverter<T> {
    fn make_internal_error(self, message: &'static str) -> Result<T, MyError>;
}

impl<T, E: std::fmt::Debug> ConvertResultErrorToMyError<T> for Result<T, E> {
    fn make_response(self, error_enum: MyError) -> Result<T, MyError> {
        match self {
            Ok(data) => Ok(data),
            Err(error) => {
                println!("{:?}", error);
                Err(error_enum)
            }
        }
    }
}

#[async_trait]
impl<T: std::marker::Send> LogMyError<T> for Result<T, MyError> {
    async fn make_log(self, error_type: ErrorLogType) -> Result<T, MyError> {
        match self {
            Ok(value) => Ok(value),
            Err(error) => {
                let error_content = match error_type {
                    ErrorLogType::USER(token) => {
                        format!("Error with a user\n\ntoken: {}\n\n{}", token, error)
                    }
                    ErrorLogType::INTERNAL => error.to_string(),
                };
                webhook_log(error_content, LOG::FAILURE).await;
                Err(error)
            }
        }
    }
}

impl<T, E: std::fmt::Debug> InternalErrorConverter<T> for Result<T, E> {
    fn make_internal_error(self, message: &'static str) -> Result<T, MyError> {
        match self {
            Ok(data) => Ok(data),
            Err(_) => Err(MyError::InternalError(message)),
        }
    }
}
