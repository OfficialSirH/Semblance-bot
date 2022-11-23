use crate::models::{UpdateUserData, UserData};
use deadpool_postgres::Client;
use tokio_pg_mapper::{Error, FromTokioPostgresRow};

pub async fn get_userdata(client: &Client, token: &str) -> Result<UserData, Error> {
    let _stmt = include_str!("../sql/get_userdata.sql");
    let _stmt = _stmt.replace("$token", format!("'{}'", &token).as_str());
    let stmt = client.prepare(&_stmt).await?;

    let queried_data = client
        .query(&stmt, &[])
        .await?
        .pop()
        .ok_or(Error::ColumnNotFound)?;

    UserData::from_row_ref(&queried_data)
}

pub async fn get_userdata_by_id(client: &Client, discord_id: &str) -> Result<UserData, Error> {
    let _stmt = include_str!("../sql/get_userdata_by_id.sql");
    let stmt = client.prepare(_stmt).await?;

    let queried_data = client
        .query(&stmt, &[&discord_id])
        .await?
        .pop()
        .ok_or(Error::ColumnNotFound)?;

    UserData::from_row_ref(&queried_data)
}

pub async fn create_userdata(
    client: &Client,
    token: &str,
    discord_id: &str,
    beta_branch: &bool,
    user_data: UpdateUserData,
) -> Result<UserData, Error> {
    let _stmt = include_str!("../sql/create_userdata.sql");
    let stmt = client.prepare(_stmt).await?;

    let queried_data = client
        .query(
            &stmt,
            &[
                &token,
                &discord_id,
                beta_branch,
                &(user_data.metabits as i64),
                &user_data.dino_rank,
                &user_data.prestige_rank,
                &user_data.beyond_rank,
                &user_data.singularity_speedrun_time,
                &user_data.all_sharks_obtained,
                &user_data.all_hidden_achievements_obtained,
                &std::time::SystemTime::now(),
            ],
        )
        .await?
        .pop()
        .ok_or(Error::ColumnNotFound)?;

    UserData::from_row_ref(&queried_data)
}

pub async fn update_userdata(
    client: &Client,
    token: &str,
    beta_branch: &bool,
    user_data: UpdateUserData,
) -> Result<UserData, Error> {
    let _stmt = include_str!("../sql/update_userdata.sql");
    let _stmt = _stmt.replace("$token", format!("'{}'", &token).as_str());
    let stmt = client.prepare(&_stmt).await?;

    let queried_data = client
        .query(
            &stmt,
            &[
                beta_branch,
                &(user_data.metabits as i64),
                &user_data.dino_rank,
                &user_data.prestige_rank,
                &user_data.beyond_rank,
                &user_data.singularity_speedrun_time,
                &user_data.all_sharks_obtained,
                &user_data.all_hidden_achievements_obtained,
                &std::time::SystemTime::now(),
            ],
        )
        .await?
        .pop()
        .ok_or(Error::ColumnNotFound)?;

    UserData::from_row_ref(&queried_data)
}

pub async fn delete_userdata(client: &Client, token: &str) -> Result<UserData, Error> {
    let _stmt = include_str!("../sql/delete_userdata.sql");
    let _stmt = _stmt.replace("$token", format!("'{}'", &token).as_str());
    let stmt = client.prepare(&_stmt).await?;

    let queried_data = client
        .query(&stmt, &[])
        .await?
        .pop()
        .ok_or(Error::ColumnNotFound)?;

    UserData::from_row_ref(&queried_data)
}
