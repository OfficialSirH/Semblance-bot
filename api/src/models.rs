use serde::{Deserialize, Serialize};
use std::time::SystemTime;
use tokio_pg_mapper_derive::PostgresMapper;

#[derive(Serialize)]
pub struct MessageResponse {
    pub message: String,
}

/// response structure for game saves metadata
#[derive(Deserialize, Debug)]
pub struct GameSavesMetadataResponse {
    #[serde(rename = "responseType")]
    pub response_type: Option<String>,
    pub url: Option<String>,
    pub error: Option<String>,
    #[serde(rename = "fileSize")]
    pub file_size: Option<u32>,
    #[serde(rename = "dateUpdated")]
    pub date_updated: Option<f64>,
    #[serde(rename = "playTime")]
    pub play_time: Option<f64>,
}

/// request structure for retrieving game saves metadata
#[derive(Serialize)]
pub struct GameSavesMetadataPostRequest {
    /// should *always* be "getmetadata"
    pub action: String,
    /// user email
    pub username: String,
    /// user access token
    pub token: String,
}

/// linked roles data structure
#[derive(Deserialize, PostgresMapper, Serialize)]
#[pg_mapper(table = "LinkedRolesUserData")]
pub struct LinkedRolesUserData {
    pub token: String,
    pub discord_id: String,
    pub access_token: String,
    pub refresh_token: String,
    pub expires_in: SystemTime,
    pub metabits: i64,
    pub dino_rank: i32,
    pub beyond_rank: i32,
    pub singularity_speedrun_time: Option<f64>,
    pub all_sharks_obtained: bool,
    pub all_hidden_achievements_obtained: bool,
    pub edited_timestamp: SystemTime,
}

/// linked roles update data structure
#[derive(Deserialize)]
pub struct UpdateLinkedRolesUserData {
    pub metabits: f64,
    pub dino_rank: i32,
    pub beyond_rank: i32,
    pub singularity_speedrun_time: Option<f64>,
    pub all_sharks_obtained: bool,
    pub all_hidden_achievements_obtained: bool,
}

/// new access token from game refreshing the access token
#[derive(Deserialize)]
pub struct PostRefreshTokenJson {
    pub initial_access_token: String,
}

/// linked roles required query for linking
#[derive(Deserialize)]
pub struct LinkedRolesQuery {
    pub email: String,
    pub token: String,
    pub distribution: String,
}

/// oauth callback response for linked roles
#[derive(Deserialize)]
pub struct LinkedRolesCallbackQuery {
    pub code: String,
    pub state: String,
}

/// access token response
#[derive(Deserialize)]
pub struct AccessTokenResponse {
    pub access_token: String,
    pub token_type: String,
    pub expires_in: u32,
    pub refresh_token: String,
    pub scope: String,
}

/// Linked Roles Metadata
#[derive(Serialize, Deserialize, Debug)]
pub struct LinkedRolesMetadata {
    pub all_hidden_achievements_obtained: bool,
    pub beyond_rank: i32,
    pub dino_rank: i32,
    pub metabits: i64,
    pub singularity_speedrun_time: Option<i32>,
}

impl From<UpdateLinkedRolesUserData> for LinkedRolesMetadata {
    fn from(data: UpdateLinkedRolesUserData) -> Self {
        LinkedRolesMetadata {
            all_hidden_achievements_obtained: data.all_hidden_achievements_obtained,
            beyond_rank: data.beyond_rank,
            dino_rank: data.dino_rank,
            metabits: data.metabits as i64,
            singularity_speedrun_time: data.singularity_speedrun_time.map(|x| x as i32),
        }
    }
}

/// Linked Roles Pushable Body
///
/// This is the body that is sent to update the metadata for discord
#[derive(Serialize, Debug)]
pub struct LinkedRolesPushBody {
    pub platform_name: String,
    pub metadata: LinkedRolesMetadata,
}
