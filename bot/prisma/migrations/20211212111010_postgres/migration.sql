-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "money" SET DEFAULT 0,
ALTER COLUMN "money" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "cost" SET DATA TYPE DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "Information" (
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expired" TEXT,
    "footer" TEXT,

    CONSTRAINT "Information_pkey" PRIMARY KEY ("type")
);

-- CreateTable
CREATE TABLE "BoosterCodes" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "BoosterCodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Leaderboard" (
    "type" TEXT NOT NULL,

    CONSTRAINT "Leaderboard_pkey" PRIMARY KEY ("type")
);

-- CreateTable
CREATE TABLE "LeaderboardUser" (
    "userId" TEXT NOT NULL,
    "level" INTEGER,
    "voteCount" INTEGER,
    "leaderboardType" TEXT NOT NULL,

    CONSTRAINT "LeaderboardUser_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "LeaderboardUser" ADD CONSTRAINT "LeaderboardUser_leaderboardType_fkey" FOREIGN KEY ("leaderboardType") REFERENCES "Leaderboard"("type") ON DELETE RESTRICT ON UPDATE CASCADE;
