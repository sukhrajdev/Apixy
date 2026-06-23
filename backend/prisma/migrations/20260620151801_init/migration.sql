-- DropForeignKey
ALTER TABLE "api" DROP CONSTRAINT "api_ownerId_fkey";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "apiToken" TEXT;

-- AddForeignKey
ALTER TABLE "api" ADD CONSTRAINT "api_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
