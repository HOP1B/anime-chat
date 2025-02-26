/*
  Warnings:

  - You are about to drop the column `modelId` on the `Message` table. All the data in the column will be lost.
  - Added the required column `modelName` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_modelId_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "modelId",
ADD COLUMN     "modelName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Model" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "imageUrl" TEXT;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_modelName_fkey" FOREIGN KEY ("modelName") REFERENCES "Model"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
