use crate::models::{AccessTokenResponse, LinkedRolesUserData, PostLinkedRolesUserDataBody};
use deadpool_postgres::Client;
use std::time::SystemTime;
use tokio_pg_mapper::{Error, FromTokioPostgresRow};

// create functions for LinkedRolesUserData, one for creating or updating, one for explicitly updating, and one for getting
pub async fn create_or_update_linkedrolesuserdata(
    client: &Client,
    token: &String,
    discord_id: &String,
    tokens: &AccessTokenResponse,
) -> Result<LinkedRolesUserData, Error> {
    let _stmt = include_str!("../sql/create_or_update_linked_roles_data.sql");
    let stmt = client.prepare(_stmt).await?;

    // expires_in is in seconds, so we need to convert it to milliseconds and add it to the current time to get the expiration time
    let expires_in = std::time::SystemTime::now()
        .checked_add(std::time::Duration::from_secs(tokens.expires_in.into()))
        .ok_or(Error::ColumnNotFound)?;

    let queried_data = client
        .query(
            &stmt,
            &[
                &token,
                &discord_id,
                &tokens.access_token,
                &tokens.refresh_token,
                &expires_in,
            ],
        )
        .await?
        .pop()
        .ok_or(Error::ColumnNotFound)?;

    LinkedRolesUserData::from_row_ref(&queried_data)
}

pub async fn update_linkedrolesuserdata(
    client: &Client,
    token: &str,
    data: &PostLinkedRolesUserDataBody,
) -> Result<LinkedRolesUserData, Error> {
    let _stmt = include_str!("../sql/update_linked_roles_data.sql");
    let _stmt = _stmt.replace("$token", format!("'{}'", &token).as_str());
    let stmt = client.prepare(&_stmt).await?;

    let queried_data = client
        .query(
            &stmt,
            &[
                &(data.metabits as i64),
                &data.dino_rank,
                &data.beyond_rank,
                &data.singularity_speedrun_time,
                &data.all_sharks_obtained,
                &data.all_hidden_achievements_obtained,
                &SystemTime::now(),
            ],
        )
        .await?
        .pop()
        .ok_or(Error::ColumnNotFound)?;

    LinkedRolesUserData::from_row_ref(&queried_data)
}

pub async fn update_linkedrolesuserdata_token(
    client: &Client,
    token: &str,
    new_token: &str,
) -> Result<LinkedRolesUserData, Error> {
    let _stmt = include_str!("../sql/update_linked_roles_data_token.sql");
    let _stmt = _stmt.replace("$token", format!("'{}'", &token).as_str());
    let stmt = client.prepare(&_stmt).await?;

    let queried_data = client
        .query(&stmt, &[&new_token])
        .await?
        .pop()
        .ok_or(Error::ColumnNotFound)?;

    LinkedRolesUserData::from_row_ref(&queried_data)
}

pub async fn get_linkedrolesuserdata(
    client: &Client,
    token: &str,
) -> Result<LinkedRolesUserData, Error> {
    let _stmt = include_str!("../sql/get_linked_roles_data.sql");
    let stmt = client.prepare(_stmt).await?;

    let queried_data = client
        .query(&stmt, &[&token])
        .await?
        .pop()
        .ok_or(Error::ColumnNotFound)?;

    LinkedRolesUserData::from_row_ref(&queried_data)
}
