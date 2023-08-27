/*
  Warnings:

  - You are about to drop the `LeaderboardUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "LeaderboardUser" DROP CONSTRAINT "LeaderboardUser_leaderboardType_fkey";

-- AlterTable
ALTER TABLE "Leaderboard" ADD COLUMN     "users" JSONB[];

-- DropTable
DROP TABLE "LeaderboardUser";
