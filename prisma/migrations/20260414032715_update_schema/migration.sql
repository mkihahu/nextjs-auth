-- DropIndex
DROP INDEX "users_teamId_idx";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "teamId" DROP NOT NULL;
