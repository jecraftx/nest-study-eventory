/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `club` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "club_name_key" ON "club"("name");
