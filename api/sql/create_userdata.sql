INSERT INTO "UserData" (
    "token",
    "discord_id",
    "beta_tester",
    "metabits",
    "dino_rank",
    "prestige_rank",
    "beyond_rank",
    "singularity_speedrun_time",
    "all_sharks_obtained",
    "all_hidden_achievements_obtained",
    "edited_timestamp"
  )
VALUES (
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7,
    $8,
    $9,
    $10,
    $11
  ) ON CONFLICT ("discord_id") DO
UPDATE
SET "token" = $1,
  "beta_tester" = $3,
  "metabits" = $4,
  "dino_rank" = $5,
  "prestige_rank" = $6,
  "beyond_rank" = $7,
  "singularity_speedrun_time" = $8,
  "all_sharks_obtained" = $9,
  "all_hidden_achievements_obtained" = $10,
  "edited_timestamp" = $11
WHERE "UserData"."discord_id" = $2
RETURNING *;