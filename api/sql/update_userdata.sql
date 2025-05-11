UPDATE "UserData"
SET "beta_tester" = $1,
  "metabits" = $2,
  "dino_rank" = $3,
  "prestige_rank" = $4,
  "beyond_rank" = $5,
  "singularity_speedrun_time" = $6,
  "all_sharks_obtained" = $7,
  "all_hidden_achievements_obtained" = $8,
  "edited_timestamp" = $9
WHERE "token" = $token
RETURNING *;