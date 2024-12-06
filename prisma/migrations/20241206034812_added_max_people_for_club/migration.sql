/*
  Warnings:

  - You are about to drop the column `deleted_at` on the `club` table. All the data in the column will be lost.
  - You are about to drop the column `joined_at` on the `club_member` table. All the data in the column will be lost.
  - Added the required column `max_people` to the `club` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `club_member` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "club" DROP COLUMN "deleted_at",
ADD COLUMN     "max_people" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "club_member" DROP COLUMN "joined_at",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
