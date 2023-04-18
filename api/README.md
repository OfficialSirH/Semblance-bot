# C2S-Linked-Roles

the REST API for handling C2S user data in Cell to Singularity for the linked roles feature

- ## Base URL
  `http://api:3000/`
  - `api` is the automatically determined IP that docker will bind to within the container
- ## Available Routes

  ### `/linked-roles`

  - takes `email`, `token`, and `distribution` as query parameters for ensuring the user going through the OAuth2 flow actually has a game transfer account in-game
  - sets 2 cookies, `clientState` for the user state, and `secretClaims` for containing a jwt encoded token that contains the user's email and token
  - automatically redirects to the discord OAuth2 prompt to request for access to creating a connection for the user's discord account

  ### `/linked-roles/oauth-callback`

  - takes the `code` and `state` query parameters from the successful discord OAuth2 prompt
  - saves the user's authorized tokens and id to the database, including the provided email and token from the claims in the `secretClaims` cookie
  - will prompt the user that the flow is complete and will instruct them to go back to the game to use in-game button that interacts with the `/linked-roles/update` route for updating their new discord connection's data

  ### `/linked-roles/update`

  - authorized via basic auth with the user's in-game account email and access token
  - updates the user's data in the database with the provided game data

  ### `/linked-roles/refresh-token`

  - authorized via basic auth with the user's in-game account email and access token
  - receives a request from the user's game when their in-game account's access token has expired, which proceeds to update the user's in-game access token to the database

- ## Authorization
  `Basic base64(email:token)`
- ## LinkedRolesUserData Definition

```rs
struct LinkedRolesUserData {
    // an HMAC token using SHA1 encryption, USERDATA_AUTH env var as key, then inserts the email and token
    pub token: String,

    // discord data
    pub discord_id: String,
    pub access_token: String,
    pub refresh_token: String,
    pub expires_in: SystemTime,

    // game data
    pub metabits: i64,
    pub dino_rank: i32,
    pub beyond_rank: i32,
    pub singularity_speedrun_time: Option<f64>,
    pub all_sharks_obtained: bool,
    pub all_hidden_achievements_obtained: bool,

    // misc
    pub edited_timestamp: SystemTime,
}
```
