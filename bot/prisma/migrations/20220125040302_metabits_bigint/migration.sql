/*
  Warnings:

  - You are about to alter the column `metabits` on the `UserData` table. The data in that column could be lost. The data in that column will be cast from `Decimal(100,0)` to `BigInt`.

*/
-- AlterTable
ALTER TABLE "UserData" ALTER COLUMN "metabits" SET DEFAULT 0,
ALTER COLUMN "metabits" SET DATA TYPE BIGINT;
