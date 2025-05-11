CREATE TABLE "LinkedRolesUserData" (
  "token" TEXT NOT NULL,
  "discord_id" TEXT NOT NULL UNIQUE,
  "access_token" TEXT NOT NULL,
  "refresh_token" TEXT NOT NULL,
  "expires_in" TIMESTAMP(3) NOT NULL,
  "metabits" BIGINT NOT NULL DEFAULT 0,
  "dino_rank" INTEGER NOT NULL DEFAULT 0,
  "beyond_rank" INTEGER NOT NULL DEFAULT 0,
  "singularity_speedrun_time" DOUBLE PRECISION,
  "all_sharks_obtained" BOOLEAN NOT NULL DEFAULT false,
  "all_hidden_achievements_obtained" BOOLEAN NOT NULL DEFAULT false,
  "edited_timestamp" TIMESTAMP(3) NOT NULL DEFAULT now(),
  CONSTRAINT "LinkedRolesUserData_pkey" PRIMARY KEY ("token")
);