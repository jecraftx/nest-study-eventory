-- AlterTable
ALTER TABLE "club" ADD COLUMN     "archived" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "event" ADD COLUMN     "archived" BOOLEAN NOT NULL DEFAULT false;
