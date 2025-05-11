-- CreateTable
CREATE TABLE "BoosterReward" (
    "userId" TEXT NOT NULL,
    "rewardingDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BoosterReward_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Game" (
    "player" TEXT NOT NULL,
    "money" BIGINT NOT NULL DEFAULT 0,
    "percentIncrease" DOUBLE PRECISION NOT NULL,
    "cost" BIGINT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "checkedLevel" INTEGER NOT NULL DEFAULT 1,
    "lastCollected" TIMESTAMP(3) NOT NULL,
    "profitRate" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("player")
);

-- CreateTable
CREATE TABLE "Reminder" (
    "userId" TEXT NOT NULL,
    "reminders" JSONB[],

    CONSTRAINT "Reminder_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Report" (
    "bugId" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("bugId")
);

-- CreateTable
CREATE TABLE "UserData" (
    "token" TEXT NOT NULL,
    "discordId" TEXT NOT NULL,
    "metabits" DECIMAL(100,0) NOT NULL DEFAULT 0,
    "dino_rank" INTEGER NOT NULL DEFAULT 0,
    "prestige_rank" INTEGER NOT NULL DEFAULT 0,
    "singularity_speedrun_time" DOUBLE PRECISION,
    "all_sharks_obtained" BOOLEAN NOT NULL DEFAULT false,
    "all_hidden_achievements_obtained" BOOLEAN NOT NULL DEFAULT false,
    "edited_timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserData_pkey" PRIMARY KEY ("token")
);

-- CreateTable
CREATE TABLE "Vote" (
    "userId" TEXT NOT NULL,
    "voteCount" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserData_discordId_key" ON "UserData"("discordId");
