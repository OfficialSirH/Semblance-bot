UPDATE "LinkedRolesUserData"
SET "metabits" = $1,
  "dino_rank" = $2,
  "beyond_rank" = $3,
  "singularity_speedrun_time" = $4,
  "all_sharks_obtained" = $5,
  "all_hidden_achievements_obtained" = $6,
  "edited_timestamp" = $7
WHERE "token" = $token
RETURNING *;