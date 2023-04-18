# C2S-Linked-Roles

the REST API for handling C2S UserData in Cell to Singularity

## Prerequisites

- ### Base URL
  `http://api:3000/`
  - `api` is the automatically determined IP that docker will bind to within the container
  ## Available Routes
- ###
- ### Authorization
  `Basic base64(email:playertoken)`
- ### UserData Definition

```rs
struct UserData {
    pub discord_id: String,
    pub token: String,
    pub beta_tester: bool,
    pub metabits: i64,
    pub dino_rank: i32,
    pub prestige_rank: i32,
    pub beyond_rank: i32,
    pub singularity_speedrun_time: Option<f64>,
    pub all_sharks_obtained: bool,
    pub all_hidden_achievements_obtained: bool,
    pub edited_timestamp: SystemTime,
}
```
