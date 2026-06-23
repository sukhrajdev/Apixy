-- AlterTable
ALTER TABLE "user" ALTER COLUMN "verificationToken" DROP NOT NULL,
ALTER COLUMN "refreshToken" DROP NOT NULL;
