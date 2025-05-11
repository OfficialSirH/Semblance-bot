CREATE TABLE "UserData" (
    "token" TEXT NOT NULL,
    "discord_id" TEXT NOT NULL UNIQUE,
    "metabits" BIGINT NOT NULL DEFAULT 0,
    "dino_rank" INTEGER NOT NULL DEFAULT 0,
    "prestige_rank" INTEGER NOT NULL DEFAULT 0,
    "beyond_rank" INTEGER NOT NULL DEFAULT 0,
    "singularity_speedrun_time" DOUBLE PRECISION,
    "all_sharks_obtained" BOOLEAN NOT NULL DEFAULT false,
    "all_hidden_achievements_obtained" BOOLEAN NOT NULL DEFAULT false,
    "beta_tester" BOOLEAN NOT NULL DEFAULT false,
    "edited_timestamp" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "UserData_pkey" PRIMARY KEY ("token")
);