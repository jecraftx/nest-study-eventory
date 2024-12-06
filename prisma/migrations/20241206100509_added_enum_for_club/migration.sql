-- CreateEnum
CREATE TYPE "ClubStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "club_join" ADD COLUMN     "status" "ClubStatus" NOT NULL DEFAULT 'PENDING';
