/*
  Warnings:

  - You are about to drop the column `TopBannerId` on the `Image` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_TopBannerId_fkey";

-- DropIndex
DROP INDEX "Image_TopBannerId_idx";

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "TopBannerId",
ADD COLUMN     "topbannerId" TEXT;

-- AlterTable
ALTER TABLE "TopBanner" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Image_topbannerId_idx" ON "Image"("topbannerId");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_topbannerId_fkey" FOREIGN KEY ("topbannerId") REFERENCES "TopBanner"("id") ON DELETE SET NULL ON UPDATE CASCADE;
