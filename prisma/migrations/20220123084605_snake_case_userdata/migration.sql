/*
  Warnings:

  - You are about to drop the column `discordId` on the `UserData` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[discord_id]` on the table `UserData` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `discord_id` to the `UserData` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "UserData_discordId_key";

-- AlterTable
ALTER TABLE "UserData" DROP COLUMN "discordId",
ADD COLUMN     "beta_tester" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "discord_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserData_discord_id_key" ON "UserData"("discord_id");
