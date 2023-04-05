INSERT INTO "LinkedRolesUserData" (
    token,
    discord_id,
    access_token,
    refresh_token,
    expires_in
  )
VALUES ($1, $2, $3, $4, $5) ON CONFLICT ("discord_id") DO
UPDATE
SET token = $1,
  access_token = $3,
  refresh_token = $4,
  expires_in = $5
WHERE "LinkedRolesUserData".discord_id = $2
RETURNING *;